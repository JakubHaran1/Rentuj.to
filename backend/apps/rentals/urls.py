from django.urls import path

from rest_framework.routers import DefaultRouter


from .views import (
    PropertyViewSet,
    ListingViewSet,
    PropertyImgViewSet,
    FiltersViewSet
)

router = DefaultRouter(trailing_slash=False)
router.register(r'properties', PropertyViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'property-imgs', PropertyImgViewSet)
router.register(r'filters', FiltersViewSet)


urlpatterns = router.urls
