from django.core.exceptions import PermissionDenied
from django.db import IntegrityError, transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Listing, Property, PropertyImg, PropertyFilterName
from .serializers import (
    ListingSerializer, PropertyImgSerializer, PropertySerializer, PropertyFilterNameSerializer,
)


class PropertyViewSet(ReadOnlyModelViewSet):
    queryset = Property.objects.filter(listings__is_active=True)
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]


class ListingViewSet(ModelViewSet):
    queryset = Listing.objects.select_related("property", "owner").filter(is_active=True).prefetch_related(
        "apartment_photos", "property_filters__rental_filter"
    )

    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["owner_id", "property_id"]

    def get_permissions(self):
        return [AllowAny()] if self.action in ["list", "retrieve"] else [IsAuthenticated()]

    def save_listing(self, serializer: ListingSerializer):
        try:
            serializer.save()
        except IntegrityError as error:
            cause = error.__cause__
            if getattr(getattr(cause, "diag", None), "constraint_name", None) == "one_active_listing_per_property":
                raise ValidationError(
                    {"is_active": "This property already has an active listing."}) from error
            raise

    def perform_create(self, serializer: ListingSerializer):
        self.save_listing(serializer)

    def perform_update(self, serializer: ListingSerializer):
        if serializer.instance.owner_id != self.request.user.pk:
            raise PermissionDenied("You can edit only your own listings.")
        self.save_listing(serializer)

    @transaction.atomic
    def perform_destroy(self, instance: Listing):
        if instance.owner_id != self.request.user.pk:
            raise PermissionDenied("You can delete only your own listings.")
        property_obj = Property.objects.select_for_update().get(pk=instance.property_id)
        instance.refresh_from_db()
        if instance.is_active:
            if property_obj.listings.exclude(pk=instance.pk).exists():
                raise ValidationError(
                    {"is_active": "Activate another listing before deleting this one."})
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
