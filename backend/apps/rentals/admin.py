from django.contrib import admin

from .models import Listing, Property, PropertyFilter, PropertyImg, PropertyFilterName


class PropertySite(admin.ModelAdmin):
    list_display = ["title",
                    "street", "home_number", "owner", "floor_number"]


class ListingSite(admin.ModelAdmin):
    list_display = ["property__title", "is_active"]


class PropertyImgSite(admin.ModelAdmin):
    list_display = ["listing__property__title", "listing"]


class FilterSite(admin.ModelAdmin):
    list_display = ["pk", "name"]


admin.site.register(Property, PropertySite)
admin.site.register(Listing, ListingSite)
admin.site.register(PropertyImg, PropertyImgSite)
admin.site.register(PropertyFilterName, FilterSite)
admin.site.register(PropertyFilter)
