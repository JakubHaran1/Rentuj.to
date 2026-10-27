from django.contrib import admin

from django.contrib import admin
from .models import Property, PropertyDetail, LandlordAdvert, PropertyImg


class PropertySite(admin.ModelAdmin):
    list_display = ["title",
                    "street", "home_number", "flat_number", "floor_number"]


class PropertyDetailSite(admin.ModelAdmin):
    list_display = ["property__title", "owner", "floor_number"]


class LandlordAdvertSite(admin.ModelAdmin):
    list_display = ["title", "property_details"]


class PropertyImgSite(admin.ModelAdmin):
    list_display = ["property_details__property__title", "property_details"]


admin.site.register(Property, PropertySite)
admin.site.register(PropertyDetail, PropertyDetailSite)
admin.site.register(LandlordAdvert, LandlordAdvertSite)
admin.site.register(PropertyImg, PropertyImgSite)
