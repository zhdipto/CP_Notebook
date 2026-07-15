from django.db import models
from django.conf import settings

# Create your models here.
class CodeSnippet(models.Model):
    title = models.CharField(max_length=100)
    code = models.TextField()
    language = models.CharField(max_length=50)
    is_public = models.BooleanField(default=True)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    favorited_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='favorited_snippets', blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    class Meta:
        ordering = ['-created_at']
