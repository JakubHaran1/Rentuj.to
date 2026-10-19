from django.contrib import admin
from .models import User, UserImg


class UserImgSite(admin.ModelAdmin):
    list_display = ["user"]


admin.site.register(User)
admin.site.register(UserImg)
# Register your models here.
