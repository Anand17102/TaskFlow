from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "due_date",
            "owner",
            "space",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
        ]

    def validate_space(self, value):
        if value is not None:
            request = self.context.get("request")

            if request and value.owner_id != request.user.id:
                raise serializers.ValidationError(
                    "You can only assign tasks to your own spaces."
                )

        return value