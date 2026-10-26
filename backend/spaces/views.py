from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Space
from .serializers import SpaceSerializer

# Create your views here.

class SpaceListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SpaceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_queryset(self): 
        return Space.objects.filter(owner=self.request.user) 
    
    def perform_create(self, serializer): 
        serializer.save(owner=self.request.user)
        

class SpaceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SpaceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Space.objects.filter(owner=self.request.user)