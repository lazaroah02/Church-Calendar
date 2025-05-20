from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    description = models.TextField()
    phone_number = models.CharField(max_length=15, blank=True)
    position = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.username

