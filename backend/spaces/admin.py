from django.contrib import admin
from .models import Space

# Register your models here.
@admin.register(Space)
class SpaceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "created_at",
        "updated_at",
    )

    list_filter = ("created_at",)
    search_fields = ("name", "description", "owner__email")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 20