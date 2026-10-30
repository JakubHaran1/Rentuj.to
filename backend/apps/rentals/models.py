from apps.users.models import User
from django.db import models

from common import create_path


class Property(models.Model):
    title = models.CharField(max_length=150)
    city = models.CharField(max_length=80)
    street = models.CharField(max_length=80)
    home_number = models.IntegerField(default=0)
    flat_number = models.IntegerField(default=0)
    floor_number = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} | {self.street} | {self.flat_number} | {self.home_number}"


class PropertyDetail(models.Model):
    property = models.OneToOneField(
        Property, related_name="property_details", on_delete=models.CASCADE)
    owner = models.ForeignKey(
        User, related_name="properties", on_delete=models.CASCADE)
    description = models.CharField(max_length=250, default="", null=True)
    number_of_levels = models.IntegerField(default=0)
    number_of_rooms = models.IntegerField(default=1)
    square_meters = models.FloatField()
    price = models.FloatField()
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    # # add auto_now_add=True,
    # date_add = models.DateTimeField(default="")
    # # add auto_now=True,
    # date_edit = models.DateTimeField(default="")

    def __str__(self):
        return f"{self.property.title}"


class PropertyImg(models.Model):
    img = models.ImageField(upload_to=create_path, default="")
    property_details = models.ForeignKey(PropertyDetail, related_name="apartment_photos",
                                         on_delete=models.CASCADE)
