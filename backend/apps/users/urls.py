from rest_framework.routers import DefaultRouter

from .views import UserViewSet
router = DefaultRouter(trailing_slash=False)
router.register(r'', UserViewSet)

urlpatterns = router.urls