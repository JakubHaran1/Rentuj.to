from django.contrib import admin

from .models import Listing, PropertyFilter, PropertyImg, PropertyFilterName


class ListingSite(admin.ModelAdmin):
    list_display = ["title", "is_active"]


class PropertyImgSite(admin.ModelAdmin):
    list_display = ["listing", "is_main"]


class FilterSite(admin.ModelAdmin):
    list_display = ["pk", "name"]


admin.site.register(Listing, ListingSite)
admin.site.register(PropertyImg, PropertyImgSite)
admin.site.register(PropertyFilterName, FilterSite)
admin.site.register(PropertyFilter)
