from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.db.models import QuerySet
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from common import email_generation, user_password_reset_token_generator, activation_token_generator
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
        email_generation(
            self.request,
            user.id,
            "users/activation_email.html",
            "users/activation_email.txt",
            "Welcome in Rentuj.to, thank you for creating a user account",
            "activate-account",
            token_generator=activation_token_generator
        )

    def update(self, request: Request, *args, **kwargs):
        instance = self.get_object()

        if instance.id != request.user.pk:
            raise ValidationError({"detail": "you can edit your profil only"})

        email_change_requested = (
            request.data.get("email") is not None
            and request.data.get("email") != instance.email
        )

        response = super().update(request, *args, **kwargs)
        instance.refresh_from_db()

        if email_change_requested and instance.new_email:
            email_generation(
                self.request,
                instance.id,
                "users/email_change_email.html",
                "users/email_change_email.txt",
                "Verify your new email address",
                "verify-email",
                to_email=instance.new_email,
            )
        return response


@api_view(["POST"])
def activate_account(request: Request, uidb64: str, token: str) -> Response:
    """activate_account but also handle change_email_requests from userUpdateForm"""
    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=user_id)

    except (ValidationError, TypeError, ValueError, User.DoesNotExist):
        return Response({"detail": "Link isn't correct."}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({"detail": "Link is incorrect or it has been expired"}, status=400)

    if not user.new_email:
        if user.is_active:
            return Response({"detail": "Account is already active"})

        user.is_active = True
        user.save(update_fields=["is_active"])

        return Response({"detail": "Account successfully activated."}, status=200)

    if user.new_email != user.email:
        user.email = user.new_email
        user.new_email = None
        user.save(update_fields=["email", "new_email"])
        return Response(
            {"detail": "Email address successfully changed."},
            status=200,
        )

    return Response({"detail": "There is no pending email change."}, status=400)


@api_view(["POST"])
def forget_password(request: Request) -> Response:
    """send a message to reset password"""
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
            "Reset your password to Rentuj.to platform",
            route_name="password-reset",
            token_generator=user_password_reset_token_generator,
            # For the frontend later:
            # link_template="http://localhost:5173/reset-password/{uidb64}/{token}",
        )

    return Response(
        {"detail": "If an account with that email exists, a reset link has been sent."}
    )


@api_view(["POST"])
def change_password(
    request: Request,
    uidb64: str,
    token: str,
) -> HttpResponse:
    """Changing password"""
    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=user_id)
        password = request.data.get("password")
        confirm = request.data.get("confirm")

    except (ValidationError, TypeError, ValueError, User.DoesNotExist):
        return Response({'detail': "Activation link isn't correct"}, status=404)

    if not user_password_reset_token_generator.check_token(user, token):
        return Response({'detail': "Activation link isn't correct"}, status=404)

    if password != confirm:
        return Response({'detail': "Password and confirm password aren't correct"}, status=404)

    user.set_password(password)
    user.save()

    return Response({'detail': "Your password has been changed"}, status=200)


@api_view(["POST"])
def resend_verification_link(request: Request, uidb64: str) -> Response:
    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        email_generation(
            request,
            user_id,
            "users/activation_email.html",
            "users/activation_email.txt",
            "Welcome in Rentuj.to, thank you for creating a user account",
            "activate-account",
            token_generator=activation_token_generator
        )
        return Response(
            {"detail": "If an account with that email exists, a reset link has been sent."}, status=200)
    except (ValidationError, TypeError, ValueError, User.DoesNotExist):
        return Response({"detail", "We can not resend your email"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def return_logged_user(request: Request) -> Response:
    return Response(UserSerializer(request.user).data)
