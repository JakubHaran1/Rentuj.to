from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import UserViewSet,activate_account

router = DefaultRouter(trailing_slash=False)
router.register(r'', UserViewSet)

urlpatterns = [
    path(
        "activate/<uidb64>/<token>",
        activate_account,
        name="activate-account",
    ),
] + router.urls