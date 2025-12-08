from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
    )
from django.db import models
from church_group.models import ChurchGroup
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

USER_PROFILE_IMAGE_MEDIA_FOLDER = 'user-profile-image'


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('User most have email')
        email = self.normalize_email(email)
        username = email.split('@')[0].lower()
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        max_length=255,
        unique=True,
        default=None,
        help_text="Unique user email address",
        db_index=True
    )
    username = models.CharField(
        max_length=255,
        unique=True,
        default=None,
        blank=True,
        help_text="Unique username",
        db_index=True
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active"
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can access the admin site"
    )
    is_superuser = models.BooleanField(
        default=False,
        help_text="Designates whether the user has superuser status"
    )

    full_name = models.CharField(
        max_length=255,
        default="",
        help_text="Full name",
        db_index=True,
    )
    description = models.TextField(blank=True, default="")
    phone_number = models.CharField(max_length=15, blank=True)
    member_groups = models.ManyToManyField(ChurchGroup, blank=True, related_name="members")
    fcm_token = models.TextField(blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, default="America/Havana")
    profile_img = models.ImageField(
        upload_to=USER_PROFILE_IMAGE_MEDIA_FOLDER, blank=True, null=True
        )
    born_at = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.username


@receiver(post_delete, sender=CustomUser)
def delete_user_image(sender, instance, **kwargs):
    """
    Delete related image from the filesystem when an user is deleted.
    """
    try:
        img = getattr(instance, "profile_img")
        if img is not None:
            img_path = img.path
            if os.path.exists(img_path):
                os.remove(img_path)
    except Exception:
        pass
