from django.urls import path

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    UserViewSet,
    activate_account,
    change_password,
    forget_password,
)

router = DefaultRouter(trailing_slash=False)
router.register(r'', UserViewSet)

urlpatterns = [
    path("token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("password/forget-password", forget_password, name="forget-password"),
    path(
        "password/reset/<uidb64>/<token>",
        change_password,
        name="password-reset",
    ),
    path(
        "activate/<uidb64>/<token>",
        activate_account,
        name="activate-account",
    ),
] + router.urls
