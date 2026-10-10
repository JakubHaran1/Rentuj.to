from datetime import date

from django.contrib.auth.tokens import default_token_generator
from django.test import TestCase
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

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