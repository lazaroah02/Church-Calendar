from django.contrib.auth.models import AbstractUser
from django.db import models
from group.models import Group

USER_PROFILE_IMAGE_MEDIA_FOLDER = 'user-profile-image'


class CustomUser(AbstractUser):
    description = models.TextField(blank=True, default="")
    phone_number = models.CharField(max_length=15, blank=True)
    groups = models.ManyToManyField(Group, blank=True)
    fcm_token = models.TextField(blank=True, null=True)
    profile_img = models.ImageField(
        upload_to=USER_PROFILE_IMAGE_MEDIA_FOLDER, blank=True, null=True
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
