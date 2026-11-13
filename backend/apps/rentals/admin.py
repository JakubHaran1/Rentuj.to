from django.contrib import admin

from .models import Listing, Property, PropertyFilter, PropertyImg, PropertyFilterName


class PropertySite(admin.ModelAdmin):
    list_display = ["title",
                    "street", "home_number",  "floor_number"]

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"


class ListingSite(admin.ModelAdmin):
    list_display = ["property__title", "owner", "is_active"]

    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "Listings"


class PropertyImgSite(admin.ModelAdmin):
    list_display = ["listing__property__title", "listing"]

    class Meta:
        verbose_name = "PropertyImg"
        verbose_name_plural = "PropertyImgs"


class FilterSite(admin.ModelAdmin):
    list_display = ["pk", "name"]

    class Meta:
        verbose_name = "RentalFilters"
        verbose_name_plural = "RentalFilters"


admin.site.register(Property, PropertySite)
admin.site.register(Listing, ListingSite)
admin.site.register(PropertyImg, PropertyImgSite)
admin.site.register(PropertyFilterName, FilterSite)
admin.site.register(PropertyFilter)
