from django.db import transaction
from rest_framework import serializers

from apps.users.serializers import UserSerializer
from common import save_img

from .models import Listing, PropertyFilter, PropertyImg, PropertyFilterName

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


class ListingSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    filters = PropertyFilterSerializer(
        many=True, source="property_filters", required=False)

    # Apartment photos associated with the listing (read-only) - these are managed separately through the PropertyImg model
    apartment_photos = PropertyImgSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            "pk", "title", "city", "street", "home_number", "floor_number",
            "number_of_levels", "number_of_rooms", "square_meters",
            "latitude", "longitude", "building_type", "owner", "is_active",
            "description", "price", "date_active", "filters", "apartment_photos",
        ]
        validators = []

    def validate(self, attrs):
        filters = attrs.get("property_filters")
        if filters is not None:
            ids = [item["rental_filter"].pk for item in filters]
            if len(ids) != len(set(ids)):
                raise serializers.ValidationError(
                    {"filters": "Each filter can only be specified once."})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        filters = validated_data.pop("property_filters", [])
        listing = Listing.objects.create(
            owner=self.context["request"].user, **validated_data
        )
        set_listing_filters(listing, filters)
        return listing

    @transaction.atomic
    def update(self, instance, validated_data):
        filters = validated_data.pop("property_filters", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        if filters is not None:
            instance.property_filters.all().delete()
            set_listing_filters(instance, filters)

        return instance
