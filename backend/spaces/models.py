from django.db import models
from django.conf import settings

# Create your models here.

class Space(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(
    upload_to="space_covers/",
    blank=True,
    null=True,
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='spaces')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint( 
                fields=["owner", "name"], 
                name="unique_space_name_per_owner", 
            ),
        ]
    
    
    def __str__(self): 
        return self.name