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


class Property(models.Model):
    title = models.CharField(max_length=150)
    city = models.CharField(max_length=80)
    street = models.CharField(max_length=80)
    home_number = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])
    floor_number = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.title} | {self.street}  | {self.home_number}"


class RentalFilter(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class PropertyDetail(models.Model):
    property = models.OneToOneField(
        Property, related_name="property_details", on_delete=models.CASCADE)
    owner = models.ForeignKey(
        User, related_name="properties", on_delete=models.CASCADE)
    description = models.CharField(max_length=250, default="", null=True)
    number_of_levels = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])
    number_of_rooms = models.IntegerField(
        default=1, validators=[MinValueValidator(0)])
    square_meters = models.FloatField(validators=[MinValueValidator(0)])
    price = models.FloatField(validators=[MinValueValidator(0)])
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    building_type = models.CharField(choices=BuildingType.choices)
    date_add = models.DateTimeField(auto_now_add=True)
    date_edit = models.DateTimeField(auto_now=True)
    date_active = models.DateField(null=True, blank=True)

    filters = models.ManyToManyField(
        RentalFilter,
        blank=True,
        related_name="properties",
        through="PropertyFilter",
    )

    def __str__(self):
        return f"{self.property.title}"


class PropertyFilter(models.Model):
    property_details = models.ForeignKey(
        PropertyDetail,
        on_delete=models.CASCADE,
        related_name="filter_assignments",
    )
    rental_filter = models.ForeignKey(
        RentalFilter,
        on_delete=models.CASCADE,
        related_name="property_assignments",
    )
    value = models.IntegerField(
        default=0, choices=[(-1, "Exclude"), (0, "Neutral"), (1, "Include")])

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["property_details", "rental_filter"],
                name="unique_property_rental_filter",
            ),
        ]


class PropertyImg(models.Model):
    img = models.ImageField(upload_to=create_path, default="")
    property_details = models.ForeignKey(PropertyDetail, related_name="apartment_photos",
                                         on_delete=models.CASCADE)
    is_main = models.BooleanField(default=False)
