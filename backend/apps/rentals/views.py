import json
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Listing, PropertyImg, PropertyFilterName
from .serializers import (
    ListingSerializer, PropertyImgSerializer, PropertyFilterNameSerializer,
)


class ListingViewSet(ModelViewSet):

    queryset = Listing.objects.select_related("owner").filter(is_active=True).prefetch_related(
        "apartment_photos", "property_filters__rental_filter"
    )

    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["owner_id"]

    def get_permissions(self):
        return [AllowAny()] if self.action in ["list", "retrieve"] else [IsAuthenticated()]

    def save_listings_with_img(self, request):
        listing_data = json.loads(request.data["listing"])
        imgs_data = json.loads(request.data["images"])

        with transaction.atomic():
            listing_serializer = ListingSerializer(
                data=listing_data, context={"request": request})

            listing_serializer.is_valid(raise_exception=True)
            listing = listing_serializer.save()

            for img_data in imgs_data:
                img_serializer = PropertyImgSerializer(
                    data={
                        "listing": listing.pk,
                        "img": request.FILES[img_data["file_key"]],
                        "is_main": img_data["is_main"],
                    },
                    context={"request": request},
                )
                img_serializer.is_valid(raise_exception=True)
                img_serializer.save()
            return listing

    def create(self, request):
        listing = self.save_listings_with_img(request)
        return Response(
            ListingSerializer(listing, context={"request": request}).data,
            status=201,
        )

    def perform_update(self, serializer: ListingSerializer):
        if serializer.instance.owner_id != self.request.user.pk:
            raise PermissionDenied("You can edit only your own listings.")

        serializer.save()

    @transaction.atomic
    def perform_destroy(self, instance: Listing):

        if instance.owner_id != self.request.user.pk:
            raise PermissionDenied("You can delete only your own listings.")

        instance.delete()


class PropertyImgViewSet(ModelViewSet):
    queryset = PropertyImg.objects.select_related("listing").all()
    serializer_class = PropertyImgSerializer

    def get_permissions(self):
        return [AllowAny()] if self.action in ["list", "retrieve"] else [IsAuthenticated()]

    def perform_update(self, serializer: PropertyImgSerializer):
        if serializer.instance.listing.owner_id != self.request.user.pk:
            raise PermissionDenied("You can edit only your own images.")
        serializer.save()

    def perform_destroy(self, instance: PropertyImg):
        if instance.listing.owner_id != self.request.user.pk:
            raise PermissionDenied("You can delete only your own images.")
        instance.delete()


class FiltersViewSet(ModelViewSet):
    queryset = PropertyFilterName.objects.order_by("name")
    serializer_class = PropertyFilterNameSerializer

    def get_permissions(self):
        return [IsAdminUser()] if self.action not in ["list", "retrieve"] else [AllowAny()]
