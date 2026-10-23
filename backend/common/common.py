# Import only type for idle to import analyze
from __future__ import annotations
from config.settings import FRONTEND_URL
import os
from pathlib import Path
from typing import TYPE_CHECKING
from uuid import UUID
from PIL import Image
from django.apps import apps
from django.contrib.auth.tokens import (
    PasswordResetTokenGenerator,
    default_token_generator,
)
from io import BytesIO

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.files.base import ContentFile


from django.core.files.uploadedfile import UploadedFile
if TYPE_CHECKING:
    from rest_framework.request import Request


class ActivationTokenGenerator(PasswordResetTokenGenerator):
    key_salt = "apps.users.activation_token_generator"

    def _make_hash_value(self, user, timestamp):
        return f"{super()._make_hash_value(user, timestamp)}{user.is_active}"


activation_token_generator = ActivationTokenGenerator()


class UserPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    key_salt = "apps.users.password_reset_token_generator"


user_password_reset_token_generator = UserPasswordResetTokenGenerator()


def create_path(instance, filename: str):
    """Create path for imgs"""
    return (
        f"{instance._meta.app_label}/"
        f"{instance._meta.model_name}/"
        f"{instance.user.pk}/"
        f"{filename}"
    )


def email_generation(
    request: Request,
    uidb: UUID,
    html_template: str,
    txt_template: str,
    subject: str,
    route_name: str,
    to_email: str | None = None,
    link_template: str | None = None,
    token_generator: PasswordResetTokenGenerator = default_token_generator,
) -> None:
    # TODO  implement re-send email on button
    """Reusable sending email function"""
    user_model = apps.get_model("users", "User")
    user = user_model.objects.get(id=uidb)
    token = token_generator.make_token(user)
    encoded_user_id = urlsafe_base64_encode(force_bytes(user.pk))
    user_email = user.email if to_email is None else to_email
    if link_template is None:
        link = f"{FRONTEND_URL}/{route_name}/{encoded_user_id}/{token}"
    else:
        # TODO: ADD "IF" ONE LEVEL BEFORE AND CHECK LINK_NEDED - THEN ADD WORKFLOW WITHOUT USER_ID AND TOKEN - ONLY LINK TEMPLATE
        link = link_template.format(uidb64=encoded_user_id, token=token)

    context = {"token": token, "link": link, "user": user}
    text = render_to_string(txt_template, context=context)
    html = render_to_string(html_template, context=context)
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text,
        from_email="from@example.com",
        to=[user_email],
        headers={"List-Unsubscribe": "<mailto:unsub@example.com>"})

    msg.attach_alternative(html, "text/html")
    msg.send()


def save_img(file_name: str, file_field: UploadedFile, size: tuple, max_w: int, max_h: int) -> ContentFile:
    """Generative function to save images"""
    file = file_field.file
    new_path = Path(file_name).stem + ".webp"
    try:
        with Image.open(file) as im:
            width, height = im.size
            if width > max_w or height > max_h:
                raise ValueError(
                    f"You may upload only an image with dimensions of {max_w}x{max_h} px.")
            if im.format not in ["JPEG", "PNG", "WEBP"]:
                raise ValueError(
                    "You may upload only an image with jpg, png or webp extension")
            im.thumbnail(size)
            buffer = BytesIO()
            im.save(buffer, format="WEBP", quality=85)
            buffer.seek(0)

            return ContentFile(buffer.read(), name=new_path)

    except (Image.UnidentifiedImageError, OSError):
        raise ValueError("Image file is incorrect")
