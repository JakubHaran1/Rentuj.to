from rest_framework.serializers import EmailField, ModelSerializer, Serializer
from rest_framework.fields import CharField, DateField
from .models import User
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class PasswordResetRequestSerializer(Serializer):
    email = EmailField()


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["name", "user_type", "avatar", "last_login", "created"]


class UserCreateSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "second_name", "email", "password",
                  "confirm_password", "user_type", "avatar", "birth_date"]
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm_password": {"write_only": True},
        }

    def create(self, validated_data) -> User:
        password = validated_data.pop("password")
        confirm_password = validated_data.pop("confirm_password")
        if password != confirm_password:
            raise ValidationError(
                {"confirm_password": "Confirm password isn't correct!"})
        email = validated_data.pop("email")
        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data,
        )
        return user

    def update(self, instance: User, validated_data: dict) -> User:
        password = validated_data.pop("password")
        confirm_password = validated_data.pop("confirm_password")
        if password != confirm_password:
            raise ValidationError({
                "confirm_password": "Confirm password isn't correct!"})

        instance = User.objects.get_or_create(id=validated_data["id"])
        instance.set_password(password)
        for key, value in validated_data:
            setattr(instance, key, value)

        return instance


class UserCustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
