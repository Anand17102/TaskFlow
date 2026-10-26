from django.urls import path
from .views import SpaceListCreateAPIView, SpaceDetailAPIView

urlpatterns = [
    path("", SpaceListCreateAPIView.as_view(), name="space-list-create"),
    path("<int:pk>/", SpaceDetailAPIView.as_view(), name="space-detail"),
    ]