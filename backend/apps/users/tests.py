from datetime import date
import hashlib

from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient
from common import user_password_reset_token_generator
from .models import User

from .tasks import test_task

from io import BytesIO
from tempfile import TemporaryDirectory
from django.core.files.uploadedfile import SimpleUploadedFile

from PIL import Image
from .models import UserImg


class BasicTest(TestCase):
    def test_backend_working(self):
        self.assertEqual(1+1, 2)

    def test_celery_working(self):
        result = test_task()
        self.assertEqual(result, "Celery is working!")


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://frontend.test",
)
class ActivationViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="resend@example.com",
            password="Old-Password!4829",
            name="resend",
            second_name="Test",
            birth_date=date(2000, 1, 1),
            is_active=True,
        )

    def test_activation_endpoint_returns_rendered_response(self):
        user = User.objects.create_user(
            email="activation@example.com",
            password="test-password",
            name="Activation",
            second_name="Test",
            birth_date=date(2000, 1, 1),
        )

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            reverse(
                "activate-account",
                kwargs={"uidb64": uidb64, "token": token},
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"detail": "Account successfully activated."},
        )
        user.refresh_from_db()
        self.assertTrue(user.is_active)

    def test_resending_verification_email(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post(
            reverse(
                "resend-verification-link",
                kwargs={"uidb64": uidb64},
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_sending_verification_email_after_email_address_change(self):
        client = APIClient()
        client.force_authenticate(user=self.user)

        response = client.patch(
            reverse("user-detail", kwargs={"pk": self.user.pk}),
            {"email": "activation2@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.new_email, "activation2@example.com")
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertIn("http://frontend.test/verify-email/", message.body)
        self.assertIn("Verify your new email address",
                      message.alternatives[0][0])
        self.assertEqual(message.to[0], "activation2@example.com")

    def test_get_user(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(
            reverse("me")
        )
        self.assertEqual(response.status_code, 200)

    @override_settings(MEDIA_ROOT="/tmp/test-media")
    def test_img_upload_with_correct_dimensions_when_old_img_doesnt_exsist(self):
        img = BytesIO()
        Image.new("RGB", (300, 300), color="pink").save(img, format="PNG")

        uploaded_img = SimpleUploadedFile(
            "avatar.png", img.getvalue(), content_type="image/png")

        client = APIClient()
        client.force_authenticate(user=self.user)
        with TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                response = client.patch(
                    reverse("user-detail", kwargs={"pk": self.user.pk}), {"avatar": uploaded_img}, format="multipart")
                self.user.refresh_from_db()
                self.assertEqual(response.status_code, 200)
                user_img = UserImg.objects.filter(
                    user=self.user).order_by("-id").first()

                self.assertTrue(user_img.img.name.endswith(".webp"))
                self.assertTrue(user_img.img.storage.exists(user_img.img.name))

    @override_settings(MEDIA_ROOT="/tmp/test-media")
    def test_img_upload_with_correct_dimensions_when_old_img_exsist(self):
        img_old = BytesIO()
        Image.new("RGB", (300, 300), "yellow").save(img_old, "png")
        uploaded_old = SimpleUploadedFile(
            "avatar.png", img_old.getvalue(), content_type="image/png")

        img_new = BytesIO()
        Image.new("RGB", (300, 300), "blue").save(img_new, "png")
        uploaded_new = SimpleUploadedFile(
            "avatar.png", img_new.getvalue(), content_type="image/png")

        client = APIClient()
        client.force_authenticate(user=self.user)

        with TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                response = client.patch(
                    reverse("user-detail", kwargs={"pk": self.user.pk}), {"avatar": uploaded_old}, format="multipart")

                self.user.refresh_from_db()
                self.assertEqual(response.status_code, 200)
                user_img = UserImg.objects.filter(
                    user=self.user).order_by("-id").first()

                self.assertTrue(user_img.img.name.endswith(".webp"))
                self.assertTrue(
                    user_img.img.storage.exists(user_img.img.name))

                user_img.img.open("rb")
                hash_value_old = hashlib.sha256(
                    user_img.img.read()).hexdigest()
                user_img.img.close()

                response = client.patch(
                    reverse("user-detail", kwargs={"pk": self.user.id}), {"avatar": uploaded_new}, format="multipart")

                self.user.refresh_from_db()
                self.assertEqual(response.status_code, 200)
                user_img = UserImg.objects.filter(
                    user=self.user).order_by("-id").first()

                self.assertTrue(user_img.img.name.endswith(".webp"))
                self.assertTrue(
                    user_img.img.storage.exists(user_img.img.name))

                user_img.img.open("rb")
                hash_value_new = hashlib.sha256(
                    user_img.img.read()).hexdigest()
                user_img.img.close()

                self.assertNotEqual(hash_value_new, hash_value_old)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://frontend.test",
)
class PasswordResetViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="reset@example.com",
            password="Old-Password!4829",
            name="Reset",
            second_name="Test",
            birth_date=date(2000, 1, 1),
            is_active=True,
        )

    def test_forgot_password_sends_frontend_reset_link(self):
        response = self.client.post(
            reverse("forget-password"),
            {"email": self.user.email},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertIn("http://frontend.test/password-reset/", message.body)
        self.assertIn("Reset your password", message.alternatives[0][0])

    def test_reset_page_changes_password_after_confirmation(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = user_password_reset_token_generator.make_token(self.user)
        reset_url = reverse(
            "password-reset",
            kwargs={"uidb64": uidb64, "token": token},
        )

        response = self.client.post(
            reset_url,
            {
                "password": "A-different-very-strong-Password-52!",
                "confirm": "A-different-very-strong-Password-52!",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Your password has been changed")
        self.user.refresh_from_db()
        login_url = reverse(
            "token_obtain_pair",
        )
        response = self.client.post(
            login_url,
            {
                "email": self.user.email,
                "password": "A-different-very-strong-Password-52!"
            },
        )

        self.assertEqual(response.status_code, 200)

    def test_reset_page_rejects_mismatched_passwords(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = user_password_reset_token_generator.make_token(self.user)
        reset_url = reverse(
            "password-reset",
            kwargs={"uidb64": uidb64, "token": token},
        )

        response = self.client.post(
            reset_url,
            {
                "password": "A-different-very-strong-Password-52!",
                "confirm": "Another-different-password-52!",
            },
        )

        self.assertEqual(response.status_code, 404)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Old-Password!4829"))

    def test_forgot_password_does_not_disclose_unknown_email(self):
        response = self.client.post(
            reverse("forget-password"),
            {"email": "unknown@example.com"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(mail.outbox), 0)
