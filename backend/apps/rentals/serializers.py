from rest_framework import serializers

from apps.users.serializers import UserSerializer

from .models import Property, PropertyDetail, PropertyImg


def save_rentals_img(property_img_data: list, property_details: dict):
    for img_data in property_img_data:
        image_pk = img_data.pop("pk", None)
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

    class Meta:
        model = PropertyImg
        fields = ["pk", "img"]


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
            "longitude", "owner", "description", "floor_number", "number_of_levels", "number_of_rooms", "price", "square_meters", "latitude", "longitude",  "apartment_photos"]

    def create(self, validated_data: dict) -> PropertyDetail:

        property_img_data = validated_data.pop("apartment_photos", [])
        property_details = PropertyDetail.objects.create(**validated_data)

        for img_data in property_img_data:
            PropertyImg.objects.create(
                property_details=property_details, **img_data)

        return property_details


class PropertySerializer(serializers.ModelSerializer):
    property_details = PropertyDetailsSerializer()

    class Meta:
        model = Property
        fields = ["pk", "title", "city", "street",
                  "home_number", "floor_number",  "property_details"]

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
