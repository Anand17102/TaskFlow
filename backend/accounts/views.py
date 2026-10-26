from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .profile_serializers import ProfileSerializer

# Create your views here.

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user