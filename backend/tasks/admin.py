from django.contrib import admin
from .models import Task

# Register your models here.
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "owner",
        "space",
        "status",
        "priority",
        "due_date",
        "created_at",
    )
    
    list_filter = ("status", "priority", "created_at","space")
    search_fields = ("title", "description", "owner__email")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20