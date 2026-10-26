from django.conf import settings
from django.db import models
from spaces.models import Space

# Create your models here.

class Task(models.Model):
    
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed" 
    
    class Priority(models.TextChoices):
        LOW = "low", "Low" 
        MEDIUM = "medium", "Medium" 
        HIGH = "high", "High"
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    space = models.ForeignKey(Space, on_delete=models.SET_NULL, related_name='tasks', null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    
    due_date = models.DateField( null=True, blank=True)
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name ="tasks"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-created_at"]
        
    def __str__(self):
        return self.title