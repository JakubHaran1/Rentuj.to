# Import only type for ide to import analyze
from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from django.contrib.auth.tokens import (
    PasswordResetTokenGenerator,
    default_token_generator,
)
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

if TYPE_CHECKING:
    from rest_framework.request import Request


class UserPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    key_salt = "apps.users.password_reset_token_generator"


user_password_reset_token_generator = UserPasswordResetTokenGenerator()


def create_path(instance, filename):
    """Create path for imgs"""
    return (
        f"{instance._meta.app_label}/"
        f"{instance._meta.model_name}/"
        f"{instance.pk}/"
        f"{filename}"
    )


def email_generation(
    request: Request,
    uidb64: UUID,
    html_template: str,
    txt_template: str,
    subject: str,
    route_name: str,
    link_template: str | None = None,
    token_generator: PasswordResetTokenGenerator = default_token_generator,
) -> None:
    # TODO  implement re-send email on button
    """Reusable sending email function"""

    from apps.users.models import User

    user = User.objects.get(id=uidb64)
    token = token_generator.make_token(user)
    encoded_user_id = urlsafe_base64_encode(force_bytes(user.pk))
    if link_template is None:
        link = request.build_absolute_uri(
            reverse(
                route_name,
                kwargs={"uidb64": encoded_user_id, "token": token},
            )
        )
    else:
        link = link_template.format(uidb64=encoded_user_id, token=token)

    context = {"token": token, "link": link, "user": user}
    text = render_to_string(txt_template, context=context)
    html = render_to_string(html_template, context=context)
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text,
        from_email="from@example.com",
        to=[user.email],
        headers={"List-Unsubscribe": "<mailto:unsub@example.com>"})

    msg.attach_alternative(html, "text/html")
    msg.send()
