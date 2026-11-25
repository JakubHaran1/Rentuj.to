from apps.users.models import User
from django.db import models

from common import create_path
from django.core.validators import MinValueValidator


class BuildingType(models.TextChoices):
    DETACHED = "DETACHED", "Detached house"
    SEMI_DETACHED = "SEMI_DETACHED", "Semi-detached house"
    TERRACED = "TERRACED", "Terraced house"
    APARTMENT_BUILDING = "APARTMENT_BUILDING", "Apartment building"
    BLOCK_OF_FLATS = "BLOCK_OF_FLATS", "Block of flats"
    TENEMENT = "TENEMENT", "Tenement building"
    ROOM_IN_SHARED_APARTMENT = (
        "ROOM_IN_SHARED_APARTMENT",
        "Room in a shared apartment",
    )


class PropertyFilterName(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "PropertyFilterNames"
        verbose_name_plural = "PropertyFilterNames"


class Listing(models.Model):
    title = models.CharField(max_length=150, blank=True, default="")
    city = models.CharField(max_length=80)
    street = models.CharField(max_length=80)
    home_number = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])
    floor_number = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])
    number_of_levels = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])
    number_of_rooms = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])
    square_meters = models.FloatField(validators=[MinValueValidator(0)])
    owner = models.ForeignKey(
        User, related_name="listings", on_delete=models.CASCADE)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    building_type = models.CharField(choices=BuildingType.choices)
    is_active = models.BooleanField(default=True)
    description = models.CharField(max_length=250, default="", null=True)
    price = models.FloatField(validators=[MinValueValidator(0)])
    date_add = models.DateTimeField(auto_now_add=True)
    date_edit = models.DateTimeField(auto_now=True)
    date_active = models.DateField(null=True, blank=True)

    filters = models.ManyToManyField(
        PropertyFilterName,
        blank=True,
        related_name="listings",
        through="PropertyFilter",
    )

    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "Listings"

    def __str__(self):
        return self.title


class PropertyFilter(models.Model):
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="property_filters",
    )
    rental_filter = models.ForeignKey(
        PropertyFilterName,
        on_delete=models.CASCADE,
        related_name="property_filters",
    )
    value = models.IntegerField(
        default=0, choices=[(-1, "Exclude"), (0, "Neutral"), (1, "Include")])

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["listing", "rental_filter"],
                name="unique_listing_rental_filter",
            ),
        ]

        verbose_name = "PropertyFilters"
        verbose_name_plural = "PropertyFilters"


class PropertyImg(models.Model):
    img = models.ImageField(upload_to=create_path, default="")
    listing = models.ForeignKey(
        Listing, related_name="apartment_photos", on_delete=models.CASCADE)
    is_main = models.BooleanField(default=False)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "PropertyImg"
        verbose_name_plural = "PropertyImgs"
        ordering = ["position", "pk"]
