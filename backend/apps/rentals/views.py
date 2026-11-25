import json
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from django.db.models import QuerySet

from .models import Listing, PropertyImg, PropertyFilterName
from .serializers import (
    ListingSerializer, PropertyImgSerializer, PropertyFilterNameSerializer,
)


class ListingViewSet(ModelViewSet):

    queryset = Listing.objects.select_related("owner").filter(is_active=True).prefetch_related(
        "apartment_photos", "property_filters__rental_filter"
    )

    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["owner_id", "floor_number", "number_of_levels",
                        "number_of_rooms", "square_meters", "building_type", "price"]
    filterset_fields = {
        "owner_id": ["exact"],
        "floor_number": ["exact"],
        "number_of_levels": ["exact"],
        "number_of_rooms": ["exact"],
        "square_meters": ["gte"],
        "building_type": ["exact"],
        "price": ["exact",  "lte"],
    }
    search_fields = ['city', 'street']

    def get_permissions(self):
        return [AllowAny()] if self.action in ["list", "retrieve"] else [IsAuthenticated()]

    def save_listings_with_img(self, request):
        try:
            listing_data = json.loads(request.data["listing"])
            imgs_data = json.loads(request.data["images"])

        except KeyError as exc:
            raise ValidationError({"detail": f"Field: {exc} is missing"})
        except json.JSONDecodeError:
            raise ValidationError({"detail": "JSON isn't valid"})

        with transaction.atomic():
            listing_serializer = ListingSerializer(
                data=listing_data, context={"request": request})

            listing_serializer.is_valid(raise_exception=True)
            listing = listing_serializer.save()

            for position, img_data in enumerate(imgs_data):
                img_serializer = PropertyImgSerializer(
                    data={
                        "listing": listing.pk,
                        "img": request.FILES[img_data["file_key"]],
                        "is_main": img_data["is_main"],
                        "position": position
                    },
                    context={"request": request},
                )
                img_serializer.is_valid(raise_exception=True)
                img_serializer.save()
            return listing

    def create(self, request: Request):
        listing = self.save_listings_with_img(request)
        return Response(
            ListingSerializer(listing, context={"request": request}).data,
            status=201,
        )

    def update(self, request: Request, *args, **kwargs):
        listing_data = json.loads(request.data["listing"])
        imgs_data = json.loads(request.data["images"])

        with transaction.atomic():
            listing_serializer = ListingSerializer(instance=self.get_object(),
                                                   data=listing_data, context={"request": request},  partial=kwargs.get("partial", False))

            listing_serializer.is_valid(raise_exception=True)
            if listing_serializer.instance.owner_id != self.request.user.pk:
                raise PermissionDenied(
                    "You can edit only your own listings.")

            listing = listing_serializer.save()

            for position, img_data in enumerate(imgs_data):
                exsited_imgs = list(
                    listing.apartment_photos.values_list("pk", flat=True))
                image_pk = img_data.get("pk")

                if image_pk is None:
                    file_key = img_data.get("file_key")
                    file = request.FILES.get(file_key) if file_key else None

                    if file is None:
                        raise ValidationError(
                            {"apartment_photos": "File is required for new imgs"})

                    img_serializer = PropertyImgSerializer(
                        data={
                            "listing": listing.pk,
                            "img": file,
                            "is_main": position == 0,
                            "position": position
                        },
                        context={"request": request},
                    )
                    img_serializer.is_valid(raise_exception=True)
                    img_serializer.save()

                elif image_pk in exsited_imgs:
                    exsited_img = listing.apartment_photos.get(pk=image_pk)
                    data = {
                        "position": position,
                        "is_main": position == 0,
                    }
                    if img_data.get("file_key") is not None:

                        file = request.FILES.get(img_data["file_key"])

                        if file is None:
                            raise ValidationError(
                                {"detail": "Something went wrong when file was saving"})

                        data["img"] = file

                        serializer = PropertyImgSerializer(
                            instance=exsited_img,
                            data=data,
                            partial=True,
                            context={"request": request},
                        )
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                    else:
                        serializer = PropertyImgSerializer(
                            instace=exsited_img,
                            data=data,
                            partial=True,
                            context={"request": request},
                        )
                        serializer.is_valid(raise_exception=True)
                        serializer.save()

                else:
                    raise ValidationError(
                        {"detail": "Something went wrong when file was saving"})
            listing.refresh_from_db()
            return Response(
                ListingSerializer(listing, context={"request": request}).data,
                status=201,
            )

    @transaction.atomic
    def perform_destroy(self, instance: Listing):

        if instance.owner_id != self.request.user.pk:
            raise PermissionDenied("You can delete only your own listings.")

        instance.delete()

    def listing_list(self,  queryset: QuerySet[Listing]):
        filter_params = self.request.query_params.getlist("filter")
        for item in filter_params:
            try:
                key, val = item.split(":")
                key, val = int(key), int(val)
            except:
                ValidationError({"filter": "Invalid filter format."})
                if key <= 0 or val not in [-1, 0, 1]:
                    raise ValidationError({"filter": "Invalid filter value."})

            if val == 0:
                continue

            queryset = queryset.filter(
                property_filters__rental_filter_id=key,
                property_filters__value=val)

        return queryset

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "list":
            queryset = self.listing_list(queryset)

        return queryset


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
