from django.db import models


class CodeSnippet(models.Model):
    title = models.CharField(max_length=100)
    code = models.TextField()
    language = models.CharField(max_length=50)

    # Opaque per-browser token supplied by the X-Device-Id header. This is the
    # ONLY ownership boundary now that there are no accounts, which is exactly
    # why the serializer never exposes it: it functions as a bearer credential,
    # so echoing it back in a response body would leak the key to the notebook.
    device_id = models.CharField(max_length=64, db_index=True)

    # A snippet belongs to exactly one device, so "who favorited this" collapses
    # from a many-to-many over users into a single flag.
    is_favorited = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        indexes = [
            # Every list query filters by device and sorts by recency.
            models.Index(
                fields=['device_id', '-created_at'],
                name='snippet_device_recent_idx',
            ),
        ]
