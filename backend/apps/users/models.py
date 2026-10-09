import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from common import create_path

import PIL

class UserType(models.TextChoices):
  OWNER = "OWNER", "OWNER"
  RENTER= "RENTER","RENTER"
  
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=254, unique=True)
    name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    user_type = models.CharField(choices=UserType.choices,default=UserType.RENTER)
    avatar = models.ImageField(upload_to=create_path, default="")
    birth_date = models.DateField()
    last_login = models.DateTimeField(auto_now_add=True)
    created = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=False)





   


