from rest_framework import serializers

from apps.users.serializers import UserSerializer
from common import save_img

from .models import Property, PropertyDetail, PropertyImg


def convert_rental_img(image):
    try:
        return save_img(image.name, image, (1024, 1024), 4000, 4000)
    except ValueError as err:
        raise serializers.ValidationError({"img": str(err)})


def save_rentals_img(property_img_data: list, property_details: PropertyDetail):
    """Funtion to save rentals img from Property and PropertyDetails serializers"""
    for img_data in property_img_data:
        image_pk = img_data.pop("pk", None)
        image_file = img_data.get("img")
        if image_file is not None:
            img_data["img"] = convert_rental_img(image_file)

        if image_pk is not None:
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
        fields = ["pk", "img", "property_details"]

    def create(self, validated_data: dict) -> PropertyImg:
        validated_data["img"] = convert_rental_img(validated_data["img"])
        return super().create(validated_data)

    def update(self, instance: PropertyImg, validated_data: dict) -> PropertyImg:
        image_file = validated_data.get("img")
        if image_file is not None:
            validated_data["img"] = convert_rental_img(image_file)
        return super().update(instance, validated_data)


class PropertyDetailsSerializer(serializers.ModelSerializer):
    apartment_photos = PropertyImgSerializer(many=True, required=False)
    owner = UserSerializer(read_only=True)
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:
        model = PropertyDetail
        fields = [
            "pk",
            "number_of_levels", "number_of_rooms", "latitude",
            "longitude", "owner", "description",  "number_of_levels", "number_of_rooms", "price", "square_meters", "latitude", "longitude",  "apartment_photos"]

    # Alternative way to create imgs -> default: images are created by imgserializer which is triggered by separate post method
    def create(self, validated_data: dict) -> PropertyDetail:

        property_img_data = validated_data.pop("apartment_photos", [])
        property_details = PropertyDetail.objects.create(**validated_data)

        save_rentals_img(property_img_data, property_details)

        return property_details

    # Add update method


class PropertySerializer(serializers.ModelSerializer):
    property_details = PropertyDetailsSerializer()

    class Meta:
        model = Property
        fields = ["pk", "title", "city", "street",
                  "home_number", "flat_number", "floor_number",
                  "property_details"]

     # Alternative way to create imgs -> default: images are created by imgserializer which is triggered by separate post method
    def create(self, validated_data: dict) -> Property:
        property_details_data = validated_data.pop("property_details", {})
        property_img_data = property_details_data.pop("apartment_photos", [])
        property_details_data["owner"] = self.context["request"].user

        property = Property.objects.create(**validated_data)
        property_details = PropertyDetail.objects.create(
            property=property, **property_details_data)

        save_rentals_img(property_img_data, property_details)

        return property

    def update(self, instance: Property, validated_data: dict) -> Property:
        property_details_data = validated_data.pop("property_details", {})
        property_img_data = property_details_data.pop("apartment_photos", [])

        for key, data in validated_data.items():
            setattr(instance, key, data)

        instance.save()
        property_details = instance.property_details

        for key, data in property_details_data.items():
            setattr(property_details, key, data)

        property_details.save()

        save_rentals_img(property_img_data, property_details)

        return instance
