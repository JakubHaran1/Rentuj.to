from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet

from .serializers import UserCreateSerializer, UserSerializer
from .models import User

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
      if self.action == "list" or self.action == "retrieve":
        return UserSerializer
      
      return UserCreateSerializer
    

 
