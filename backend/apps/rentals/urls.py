from django.urls import path

from rest_framework.routers import DefaultRouter


from .views import (
    PropertyViewSet,
    ListingViewSet,
    PropertyImgViewSet,
    FiltersViewSet,
    get_listings_for_property
)

router = DefaultRouter(trailing_slash=False)
router.register(r'properties', PropertyViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'property-imgs', PropertyImgViewSet)
router.register(r'filters', FiltersViewSet)
urlpatterns = [
    path("properties/<property_id>/listings",
         get_listings_for_property, name="get_listings_for_property")
]

urlpatterns += router.urls
