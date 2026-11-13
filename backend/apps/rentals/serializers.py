from django.db import transaction
from rest_framework import serializers

from apps.users.serializers import UserSerializer
from common import save_img

from .models import Listing, Property, PropertyFilter, PropertyImg, PropertyFilterName

MAX_PROPERTY_IMAGES = 10


def convert_rental_img(image):
    try:
        return save_img(image.name, image, (1024, 1024), 4000, 4000)
    except ValueError as err:
        raise serializers.ValidationError({"img": str(err)})


def set_listing_filters(listing, filters_data):
    """Set filters for a listing."""
    PropertyFilter.objects.bulk_create([
        PropertyFilter(
            listing=listing, rental_filter=item["rental_filter"], value=item["value"])
        for item in filters_data
    ])


class PropertyImgSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all(), write_only=True)

    class Meta:
        model = PropertyImg
        fields = ["pk", "img", "is_main", "listing"]

    def validate_listing(self, listing):
        request = self.context["request"]
        if listing.owner_id != request.user.pk:

            raise serializers.ValidationError(
                "You can add images only to your own listings.")

        if self.instance and listing.pk != self.instance.listing_id:

            raise serializers.ValidationError(
                "An image cannot be moved to another listing.")

        return listing

    @transaction.atomic
    def create(self, validated_data):
        listing = Listing.objects.select_for_update().get(
            pk=validated_data["listing"].pk)

        if listing.apartment_photos.count() >= MAX_PROPERTY_IMAGES:
            raise serializers.ValidationError(
                {"img": f"Listing can have up to {MAX_PROPERTY_IMAGES} images."})

        validated_data["img"] = convert_rental_img(validated_data["img"])

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "img" in validated_data:
            validated_data["img"] = convert_rental_img(validated_data["img"])
        return super().update(instance, validated_data)


class PropertyFilterNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyFilterName
        fields = ["pk", "name"]


class PropertyFilterSerializer(serializers.ModelSerializer):
    pk = serializers.PrimaryKeyRelatedField(
        source="rental_filter",
        queryset=PropertyFilterName.objects.all(),
    )
    name = serializers.CharField(source="rental_filter.name", read_only=True)

    class Meta:
        model = PropertyFilter
        fields = ["pk", "name", "value"]


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "pk", "title", "city", "street", "home_number", "floor_number",
            "number_of_levels", "number_of_rooms", "square_meters",
            "latitude", "longitude", "building_type",
        ]


class ListingSerializer(serializers.ModelSerializer):
    property = PropertySerializer(required=False)
    property_id = serializers.PrimaryKeyRelatedField(
        source="existing_property", queryset=Property.objects.all(),
        write_only=True, required=False,
    )
    owner = UserSerializer(read_only=True)
    filters = PropertyFilterSerializer(
        many=True, source="property_filters", required=False)

    # Apartment photos associated with the listing (read-only) - these are managed separately through the PropertyImg model
    apartment_photos = PropertyImgSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            "pk", "property", "property_id", "title", "is_active", "owner",
            "description", "price", "date_active", "filters", "apartment_photos",
        ]
        validators = []

    def to_representation(self, instance):
        """Customize the representation of a listing instance."""
        data = super().to_representation(instance)
        title = instance.title
        if instance.property.listings.count() > 1:
            title = f'{instance.title} ({instance.property.listings.count()})'
        data["title"] = title or instance.property.title
        return data

    def validate(self, attrs):
        property_data = attrs.get("property")
        existing_property = attrs.get("existing_property")

        if self.instance is None:
            if property_data is None and existing_property is None:
                raise serializers.ValidationError(
                    "Provide either property or property_id.")

            if property_data is not None and existing_property is not None:
                raise serializers.ValidationError(
                    "Provide only one of property or property_id.")

            if property_data is not None and not attrs.get("is_active", True):
                raise serializers.ValidationError(
                    {"is_active": "The first listing must be active."})

            if existing_property and not existing_property.listings.filter(
                owner=self.context["request"].user
            ).exists():
                raise serializers.ValidationError(
                    {"property_id": "You cannot add a listing to this property."})

        elif existing_property is not None:
            raise serializers.ValidationError(
                {"property_id": "A listing cannot be moved to another property."})

        filters = attrs.get("property_filters")
        if filters is not None:
            ids = [item["rental_filter"].pk for item in filters]
            if len(ids) != len(set(ids)):
                raise serializers.ValidationError(
                    {"filters": "Each filter can only be specified once."})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        property_data = validated_data.pop("property", None)
        existing_property = validated_data.pop("existing_property", None)
        filters = validated_data.pop("property_filters", [])

        if existing_property is None:
            property_obj = Property.objects.create(**property_data)
        else:
            property_obj = Property.objects.select_for_update().get(pk=existing_property.pk)

        # Change the previously active listing
        if validated_data.get("is_active", True):
            property_obj.listings.filter(
                is_active=True).update(is_active=False)

        listing = Listing.objects.create(
            property=property_obj, owner=self.context["request"].user, **validated_data
        )
        set_listing_filters(listing, filters)
        return listing

    @transaction.atomic
    def update(self, instance, validated_data):
        property_data = validated_data.pop("property", None)
        filters = validated_data.pop("property_filters", None)
        property_obj = Property.objects.select_for_update().get(pk=instance.property_id)
        instance.refresh_from_db()

        if validated_data.get("is_active") is True and not instance.is_active:
            property_obj.listings.filter(
                is_active=True).update(is_active=False)

        if property_data is not None:
            for key, value in property_data.items():
                setattr(property_obj, key, value)

            property_obj.save()
            instance.property = property_obj

        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        if filters is not None:
            instance.property_filters.all().delete()
            set_listing_filters(instance, filters)

        return instance
