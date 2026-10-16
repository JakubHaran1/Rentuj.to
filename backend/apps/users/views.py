from django.contrib.auth.forms import SetPasswordForm
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import HttpRequest, HttpResponse
from django.db.models import QuerySet
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import render
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.http import require_http_methods

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.viewsets import ModelViewSet

from common import email_generation, user_password_reset_token_generator, save_img
from .serializers import (
    PasswordResetRequestSerializer,
    UserCreateSerializer,
    UserSerializer,
)
from .models import User


class UserViewSet(ModelViewSet):
    queryset: QuerySet[User] = User.objects.all()

    def get_serializer_class(
        self,
    ) -> type[UserSerializer] | type[UserCreateSerializer]:
        if self.action == "list" or self.action == "retrieve":
            return UserSerializer

        return UserCreateSerializer

    def perform_create(self, serializer: BaseSerializer) -> None:
        user = serializer.save()
        save_img(user.avatar, (528, 528))
        email_generation(
            self.request,
            user.id,
            "users/activation_email.html",
            "users/activation_email.txt",
            "Welcome in Rentuj.to, thank you for creating a user account",
            "activate-account"
        )


@api_view(["GET"])
def activate_account(request: Request, uidb64: str, token: str) -> Response:
    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=user_id)
    except (DjangoValidationError, TypeError, ValueError, User.DoesNotExist):
        return Response({"detail": "Link isn't correct."}, status=400)

    if user.is_active:
        return Response({"detail": "Account is already active"})

    if not default_token_generator.check_token(user, token):
        return Response({"detail": "Link is incorrect or it has been expired"}, status=400)

    user.is_active = True
    user.save(update_fields=["is_active"])

    return Response({"detail": "Account successfully activated."}, status=200)


@api_view(["POST"])
def forget_password(request: Request) -> Response:
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = User.objects.filter(
        email=serializer.validated_data["email"]).first()

    if user is not None:
        email_generation(
            request,
            user.id,
            "users/password_reset_email.html",
            "users/password_reset_email.txt",
            "Reset your Rentuj.to password",
            route_name="password-reset",
            token_generator=user_password_reset_token_generator,
            # For the frontend later:
            # link_template="http://localhost:5173/reset-password/{uidb64}/{token}",
        )

    return Response(
        {"detail": "If an account with that email exists, a reset link has been sent."}
    )


@require_http_methods(["GET", "POST"])
def change_password(
    request: HttpRequest,
    uidb64: str,
    token: str,
) -> HttpResponse:
    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=user_id)
    except (DjangoValidationError, TypeError, ValueError, User.DoesNotExist):
        return Response({'detail': "Activation link isn't correct"}, status=404)

    if not user_password_reset_token_generator.check_token(user, token):
        return Response({'detail': "Activation link isn't correct"}, status=404)

    return Response({'detail': "Your password has been changed"}, status=200)
