from rest_framework import serializers

from apps.users.serializers import UserSerializer
from common import save_img

from .models import (
    Property,
    PropertyDetail,
    PropertyFilter,
    PropertyImg,
    RentalFilter,
)
MAX_PROPERTY_IMAGES = 10


def convert_rental_img(image):
    try:
        return save_img(image.name, image, (1024, 1024), 4000, 4000)
    except ValueError as err:
        raise serializers.ValidationError({"img": str(err)})


def validate_img_count_limit(property_details, property_img_data=1):
    current_count = property_details.apartment_photos.count()

    if current_count + property_img_data > MAX_PROPERTY_IMAGES:
        raise serializers.ValidationError({
            "img": f"Property can have up to {MAX_PROPERTY_IMAGES} images."
        })


def save_rentals_img(property_img_data: list, property_details: PropertyDetail):
    """Funtion to save rentals img from Property and PropertyDetails serializers"""

    for img_data in property_img_data:
        # If pk ==none model with file doesnt exsist and it needs to be created
        image_pk = img_data.pop("pk", None)
        image_file = img_data.get("img")
        if image_file is not None:
            img_data["img"] = convert_rental_img(image_file)

        if image_pk is not None:
            validate_img_count_limit(property_details)
            image = PropertyImg.objects.get(
                pk=image_pk, property_details=property_details)
            for key, data in img_data.items():
                setattr(image, key, data)
            image.save()
        else:
            PropertyImg.objects.create(
                property_details=property_details, **img_data)


class PropertyImgSerializer(serializers.ModelSerializer):
    pk = serializers.IntegerField(required=False)
    property_details = serializers.PrimaryKeyRelatedField(
        queryset=PropertyDetail.objects.all(),
        write_only=True,
    )

    class Meta:
        model = PropertyImg
        fields = ["pk", "img", "is_main", "property_details"]

    def create(self, validated_data: dict) -> PropertyImg:
        property_details = validated_data["property_details"]
        validate_img_count_limit(property_details)
        validated_data["img"] = convert_rental_img(validated_data["img"])
        return super().create(validated_data)

    # TODO: trzeba zmienic przy edycji formularza
    def update(self, instance: PropertyImg, validated_data: dict) -> PropertyImg:
        property_details = validated_data["property_details"]
        image_file = validated_data.get("img")
        validate_img_count_limit(property_details)
        if image_file is not None:
            validated_data["img"] = convert_rental_img(image_file)
        return super().update(instance, validated_data)


class PropertyFilterSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(
        source="rental_filter",
        queryset=RentalFilter.objects.all(),
    )
    name = serializers.CharField(source="rental_filter.name", read_only=True)

    class Meta:
        model = PropertyFilter
        fields = ["id", "name", "value"]


def set_property_filters(
    property_details: PropertyDetail,
    filters_data: list[dict],
) -> None:
    PropertyFilter.objects.bulk_create(
        [
            PropertyFilter(
                property_details=property_details,
                rental_filter=filter_data["rental_filter"],
                value=filter_data["value"],
            )
            for filter_data in filters_data
        ],
    )


class PropertyDetailsSerializer(serializers.ModelSerializer):
    apartment_photos = PropertyImgSerializer(many=True, required=False)
    owner = UserSerializer(read_only=True)

    filters = PropertyFilterSerializer(
        many=True,
        source="filter_assignments",
        required=False,
    )

    class Meta:
        model = PropertyDetail
        fields = [
            "pk",
            "number_of_levels", "number_of_rooms", "latitude",
            "longitude", "owner", "description", "price", "square_meters",
            "building_type", "date_active", "filters", "apartment_photos"]

    def create(self, validated_data: dict) -> PropertyDetail:
        property_img_data = validated_data.pop("apartment_photos", [])
        filters_data = validated_data.pop("filter_assignments", [])
        property_details = PropertyDetail.objects.create(**validated_data)
        set_property_filters(property_details, filters_data)

        # Alternative way to create imgs -> default: images are created by imgserializer which is triggered by separate post method
        save_rentals_img(property_img_data, property_details)

        return property_details

    # TODO: Add update method


class PropertySerializer(serializers.ModelSerializer):
    property_details = PropertyDetailsSerializer()

    class Meta:
        model = Property
        fields = ["pk", "title", "city", "street",
                  "home_number",  "floor_number",
                  "property_details"]

    def create(self, validated_data: dict) -> Property:
        property_details_data = validated_data.pop("property_details", {})
        property_img_data = property_details_data.pop("apartment_photos", [])
        property_details_data["owner"] = self.context["request"].user
        filters_data = property_details_data.pop("filter_assignments", [])

        property = Property.objects.create(**validated_data)
        property_details = PropertyDetail.objects.create(
            property=property, **property_details_data)

        set_property_filters(property_details, filters_data)
        property_details.save()
        # Alternative way to create imgs -> default: images are created by imgserializer which is triggered by separate post method
        save_rentals_img(property_img_data, property_details)

        return property

    def update(self, instance: Property, validated_data: dict) -> Property:
        property_details_data = validated_data.pop("property_details", {})
        property_img_data = property_details_data.pop("apartment_photos", [])
        filters_data = property_details_data.pop("filter_assignments", [])

        for key, data in validated_data.items():
            setattr(instance, key, data)

        instance.save()
        property_details = instance.property_details

        for key, data in property_details_data.items():
            setattr(property_details, key, data)

        PropertyFilter.objects.filter(
            property_details=property_details).delete()
        set_property_filters(property_details, filters_data)
        property_details.save()
        # Alternative way to create imgs -> default: images are created by imgserializer which is triggered by separate post method
        save_rentals_img(property_img_data, property_details)

        return instance


class RentalFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalFilter
        fields = ["pk", "name"]
