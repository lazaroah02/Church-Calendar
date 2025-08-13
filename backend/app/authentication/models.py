from django.contrib.auth.models import AbstractUser
from django.db import models
from liga.models import Liga

USER_PROFILE_IMAGE_MEDIA_FOLDER = 'user-profile-image'


class CustomUser(AbstractUser):
    description = models.TextField()
    phone_number = models.CharField(max_length=15, blank=True)
    ligas = models.ManyToManyField(Liga, blank=True)
    fcm_token = models.TextField(blank=True, null=True)
    profile_img = models.ImageField(
        upload_to=USER_PROFILE_IMAGE_MEDIA_FOLDER, blank=True, null=True
        )

    def __str__(self):
        return self.username

