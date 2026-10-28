import hashlib

from rest_framework.serializers import EmailField, ModelSerializer, Serializer, ImageField
from rest_framework.fields import CharField, DateField
from .models import User, UserImg
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from common import save_img
from datetime import date


class PasswordResetRequestSerializer(Serializer):
    email = EmailField()


class UserImgSerializer(ModelSerializer):
    class Meta:
        model = UserImg
        fields = ["img", "user"]

    def create(self, validated_data):
        try:
            img = validated_data["img"]
            filename = img.name
            validated_data["img"] = save_img(filename,
                                             img, (512, 512), 4000, 4000)
        except ValueError as err:
            raise ValidationError(str(err))

        return super().create(validated_data)


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["name", "second_name", "email", "user_type",
                  "avatar", "last_login", "created"]


class UserCreateSerializer(ModelSerializer):
    password = CharField(write_only=True, required=False)
    confirm_password = CharField(write_only=True, required=False)
    avatar = ImageField(write_only=True, required=False)

    # def validate_birth_date(self, val):
    #     today = date.today()
    #     age = (
    #         today.year
    #         - val.year
    #         - ((today.month, today.day) < (val.month, val.day))
    #     )
    #     if age < 18:
    #         raise ValidationError(
    #             "To create an account you need to be at least 18 years old")
    #     print(repr(val))
    #     return val

    class Meta:
        model = User
        fields = ["name", "second_name", "email", "password",
                  "confirm_password", "user_type", "avatar", "birth_date"]
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm_password": {"write_only": True},
        }

    def create(self, validated_data: dict) -> User:
        password = validated_data.pop("password", None)
        confirm_password = validated_data.pop("confirm_password", None)
        avatar_data = validated_data.pop("avatar")

        if not password:
            raise ValidationError({"password": "This field is required."})

        if confirm_password is None:
            raise ValidationError(
                {"confirm_password": "This field is required."})

        if password != confirm_password:
            raise ValidationError(
                {"confirm_password": "Confirm password isn't correct!"})
        email = validated_data.pop("email")
        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data,
        )

        if avatar_data:
            try:
                converted_avatar = save_img(
                    avatar_data.name,
                    avatar_data,
                    (512, 512),
                    4000,
                    4000,
                )
                print("a", converted_avatar.name)
            except ValueError as err:
                raise ValidationError("avatar", str(err))

            UserImg.objects.create(
                user=user,
                img=converted_avatar,
            )

        return user

    def update(self, instance: User, validated_data: dict) -> User:
        password = validated_data.pop("password", None)
        confirm_password = validated_data.pop("confirm_password", None)
        avatar_data = validated_data.pop("avatar", None)
        email = validated_data.pop("email", None)

        if password is not None or confirm_password is not None:
            if not password:
                raise ValidationError({"password": "Password is required."})
            if password != confirm_password:
                raise ValidationError({
                    "confirm_password": "Confirm password isn't correct!"})

            instance.set_password(password)

        if email is not None:
            instance.new_email = email if email != instance.email else None

        if avatar_data:

            old_img = UserImg.objects.filter(
                user=instance).order_by("-id").first()

            if old_img:
                old_img.img.open("rb")
                old_hash = hashlib.sha256(old_img.img.read()).hexdigest()
                old_img.img.close()

                avatar_data.seek(0)
                new_hash = hashlib.sha256(avatar_data.read()).hexdigest()

                if (old_hash != new_hash):
                    avatar_data.seek(0)
                    converted_avatar = save_img(avatar_data.name,
                                                avatar_data,
                                                (512, 512),
                                                4000,
                                                4000,)
                    UserImg.objects.create(user=instance,
                                           img=converted_avatar)
            else:
                converted_avatar = save_img(
                    avatar_data.name, avatar_data, (512, 512), 4000, 4000,)
                UserImg.objects.create(user=instance,
                                       img=converted_avatar)

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance


class UserCustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
