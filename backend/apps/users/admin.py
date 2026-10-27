from django.contrib import admin
from .models import User, UserImg


class UserSite(admin.ModelAdmin):
    list_display = ["name", "second_name",]


class UserImgSite(admin.ModelAdmin):
    list_display = ["user"]


admin.site.register(User, UserSite)
admin.site.register(UserImg, UserImgSite)
# Register your models here.
