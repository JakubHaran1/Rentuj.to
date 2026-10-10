from django.core.mail import EmailMultiAlternatives
from django.shortcuts import render

from django.contrib.auth.tokens import default_token_generator

from django.template.loader import render_to_string
from django.urls import reverse
from django.db import transaction

from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from .serializers import UserCreateSerializer, UserSerializer
from .models import User


def activate_email_generation(request,uidb):

  user = User.objects.get(uidb)
  token = default_token_generator.make_token(user)
  activation_link = request.build_absolute_uri(
     reverse("activate-account",kwargs={"uidb64":user.id,"token":token})
     )
  
  context = {"token":token,"activation_link":activation_link}
  text = render_to_string("users/activation_email.txt",context=context)
  html = render_to_string("users/activation_email.html",context=context)
  msg = EmailMultiAlternatives(
    subject="Subject here",
    body=text,
    from_email="from@example.com",
    to=[user.email],
    headers={"List-Unsubscribe": "<mailto:unsub@example.com>"})
  
  msg.attach_alternative(html, "text/html")
  msg.send()
  return Response({"detail": "Email has sended sucefully","uidb":uidb})
   
def activate_account(uidb64,token):
    try:
        user = User.objects.get(id=uidb64)
    except (TypeError, ValueError, User.DoesNotExist):
        return Response({"detail": "Link isn't correct."}, status=400)

    if user.is_active:
        return Response({"detail": "Account is already active"})

    if not default_token_generator.check_token(user, token):
        return Response({"detail": "Link is incorrect or it has been expired"}, status=400)

    user.is_active = True
    user.save(update_fields=["is_active"])

    return Response({"detail": "Account successfully activated."})
   
  
   
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
      if self.action == "list" or self.action == "retrieve":
        return UserSerializer
      
      return UserCreateSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        activate_email_generation(self.request,user.id)
        
    

 
