from rest_framework import serializers
from .models import Space

class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = [
            "id",
            "name",
            "description",
            "cover_image",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
        ]
