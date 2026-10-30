from django.contrib import admin

from django.contrib import admin
from .models import Property, PropertyDetail,  PropertyImg


class PropertySite(admin.ModelAdmin):
    list_display = ["title",
                    "street", "home_number", "flat_number", "floor_number"]

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"


class PropertyDetailSite(admin.ModelAdmin):
    list_display = ["property__title", "owner"]

    class Meta:
        verbose_name = "PropertyDetail"
        verbose_name_plural = "PropertyDetails"


class PropertyImgSite(admin.ModelAdmin):
    list_display = ["property_details__property__title", "property_details"]

    class Meta:
        verbose_name = "PropertyImg"
        verbose_name_plural = "PropertyImgs"


admin.site.register(Property, PropertySite)
admin.site.register(PropertyDetail, PropertyDetailSite)

admin.site.register(PropertyImg, PropertyImgSite)
