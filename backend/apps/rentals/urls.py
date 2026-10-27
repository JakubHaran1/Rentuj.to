from django.urls import path

from rest_framework.routers import DefaultRouter


from .views import (
    PropertyViewSet,
    PropertyDetailsViewSet,
    LandlordAdvertViewSet,
    PropertyImgViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register(r'properties', PropertyViewSet)
router.register(r'property-details', PropertyDetailsViewSet)
router.register(r'property-advertisement', LandlordAdvertViewSet)
router.register(r'property-imgs', PropertyImgViewSet)


urlpatterns = router.urls
