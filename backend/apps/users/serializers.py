from rest_framework.serializers import ModelSerializer
from rest_framework.fields import CharField
from .models import User
from rest_framework.exceptions import ValidationError
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["name","user_type","avatar","last_login","created"]

class UserCreateSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)
    class Meta:
        model = User
        fields = ["name","second_name","email","password","confirm_password","user_type","avatar","birth_date"]
        extra_kwargs = {
                        "password": {"write_only": True},
                        "confirm_password": {"write_only": True},
                    }
      
    
    def create(self, validated_data):
        password = validated_data.pop("password")
        confirm_password = validated_data.pop("confirm_password")
        if password != confirm_password:
            raise ValidationError({"confirm_password":"Confirm password isn't correct!"})
        email = validated_data.pop("email")
        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data,
        )
        return user

    def update(self, instance, validated_data):

        password = validated_data.pop("password")
        user = User.objects.get_or_create(id=validated_data["id"])
        user.set_password(password)
        return user