from django.db import models

LIGAS_IMAGES_FILDER = 'ligas_images'


class Liga(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    img = models.ImageField(
        upload_to=LIGAS_IMAGES_FILDER,
        blank=True, null=True
        )

    def __str__(self):
        return self.name
