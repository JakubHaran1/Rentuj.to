from django.test import TestCase
from .tasks import test_task
class BasicTest(TestCase):
    def test_backend_working(self):
        self.assertEqual(1+1,2)

    def test_celery_working(self):
        result = test_task()
        self.assertEqual(result,"Celery is working!")