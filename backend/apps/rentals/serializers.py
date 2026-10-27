from rest_framework import serializers

from .models import Property, PropertyDetail, LandlordAdvert, PropertyImg
from apps.users.serializers import UserSerializer


class PropertyImgSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyImg
        fields = ["img"]


class LandlordAdvertSerializer(serializers.ModelSerializer):

    class Meta:
        model = LandlordAdvert
        fields = ["title", "price"]


class PropertyDetailsSerializer(serializers.ModelSerializer):
    adverts = LandlordAdvertSerializer(many=True, required=False)
    apartment_photos = PropertyImgSerializer(many=True, required=False)
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:
        model = PropertyDetail
        fields = [
            "number_of_levels", "number_of_rooms", "latitude",
            "longitude", "owner", "description", "floor_number", "number_of_levels", "number_of_rooms", "square_meters", "latitude", "longitude", "apartment_photos", "adverts"]

    def create(self, validated_data: dict) -> Property:
        landlord_advert_data = validated_data.pop("adverts", None)
        property_img_data = validated_data.pop("apartment_photos", None)
        property_details = PropertyDetail.objects.create(**validated_data)

        for img_data in property_img_data:
            PropertyImg.objects.create(
                property_details=property_details, **img_data)

        LandlordAdvert.objects.create(**landlord_advert_data)

        return property_details


class PropertySerializer(serializers.ModelSerializer):
    property_details = PropertyDetailsSerializer()

    class Meta:
        model = Property
        fields = ["title", "city", "street",
                  "home_number", "floor_number",  "property_details"]

    def create(self, validated_data: dict) -> Property:
        property_details_data = validated_data.pop("property_details", {})
        landlord_advert_data = property_details_data.pop("adverts", [])
        property_img_data = property_details_data.pop("apartment_photos", [])

        property = Property.objects.create(**validated_data)

        property_details = PropertyDetail.objects.create(
            property=property, **property_details_data)

        for img_data in property_img_data:
            PropertyImg.objects.create(
                property_details=property_details, **img_data)

        for advert_data in landlord_advert_data:
            LandlordAdvert.objects.create(
                property_details=property_details,
                **advert_data
            )

        return property
