from django.shortcuts import render,redirect
from rest_framework import generics, permissions
from .models import Task
from .serializers import TaskSerializer

# Create your views here.

class TaskListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permissions_class = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Task.objects.filter(owner=self.request.user)

        space_id = self.request.query_params.get("space")

        if space_id:
            queryset = queryset.filter(space_id=space_id)

        return queryset
    
    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

class TaskDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permissions_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user) 
