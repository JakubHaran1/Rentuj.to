from django.shortcuts import render
from django.db.models import QuerySet
from django.core.exceptions import PermissionDenied


from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, PropertyDetail, PropertyImg
from .serializers import PropertySerializer, PropertyDetailsSerializer, PropertyImgSerializer


class PropertyViewSet(ModelViewSet):
    queryset: QuerySet[Property] = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["property_details__owner_id"]

    def get_permissions(self):
        if self.action not in ["list", "retrieve"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        owner = instance.property_details.owner
        if owner.pk != request.user.pk:
            raise PermissionDenied(
                {"detail: You can edit only your own properties"})
        return super().update(request, *args, **kwargs)


class PropertyDetailsViewSet(ModelViewSet):
    queryset: QuerySet[PropertyDetail] = PropertyDetail.objects.all()
    serializer_class = PropertyDetailsSerializer

    def get_permissions(self):
        if self.action not in ["list", "retrieve"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner.pk != self.request.user.pk:
            raise PermissionDenied(
                {"detail: You can edit only your own properties"})

        return super().update(request, *args, **kwargs)


class PropertyImgViewSet(ModelViewSet):
    queryset: QuerySet[PropertyImg] = PropertyImg.objects.all()
    serializer_class = PropertyImgSerializer

    def get_permissions(self):
        if self.action not in ["list", "retrieve"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner.pk != self.request.user.pk:
            raise PermissionDenied(
                {"detail: You can edit only your own properties"})
        return super().update(request, *args, **kwargs)
