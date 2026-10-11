from datetime import date

from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from common import user_password_reset_token_generator
from .models import User

from .tasks import test_task


class BasicTest(TestCase):
    def test_backend_working(self):
        self.assertEqual(1+1,2)

    def test_celery_working(self):
        result = test_task()
        self.assertEqual(result,"Celery is working!")


class ActivationViewTest(TestCase):
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

        response = self.client.get(
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


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
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

    def test_forgot_password_sends_backend_reset_link(self):
        response = self.client.post(
            reverse("forget-password"),
            {"email": self.user.email},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertIn("/api/users/password/reset/", message.body)
        self.assertIn("Reset your password", message.alternatives[0][0])

    def test_reset_page_changes_password_after_confirmation(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = user_password_reset_token_generator.make_token(self.user)
        reset_url = reverse(
            "password-reset",
            kwargs={"uidb64": uidb64, "token": token},
        )

        get_response = self.client.get(reset_url)
        self.assertEqual(get_response.status_code, 200)
        self.assertContains(get_response, 'name="new_password1"')
        self.assertContains(get_response, 'name="new_password2"')

        response = self.client.post(
            reset_url,
            {
                "new_password1": "A-different-very-strong-Password-52!",
                "new_password2": "A-different-very-strong-Password-52!",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Password changed")
        self.user.refresh_from_db()
        self.assertTrue(
            self.user.check_password("A-different-very-strong-Password-52!")
        )

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
                "new_password1": "A-different-very-strong-Password-52!",
                "new_password2": "Another-different-password-52!",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "The two password fields didn")
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