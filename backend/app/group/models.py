from django.db import models

GROUPS_IMAGES_FILDER = 'groups_images'


class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    img = models.ImageField(
        upload_to=GROUPS_IMAGES_FILDER,
        blank=True, null=True
        )

    def __str__(self):
        return self.name
