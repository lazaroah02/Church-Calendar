from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
    )
from django.db import models
from church_group.models import ChurchGroup

USER_PROFILE_IMAGE_MEDIA_FOLDER = 'user-profile-image'


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('User most have email')
        email = self.normalize_email(email)
        user = self.model(email=email)
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
        db_index=True
    )
    description = models.TextField(blank=True, default="")
    phone_number = models.CharField(max_length=15, blank=True)
    member_groups = models.ManyToManyField(ChurchGroup, blank=True, related_name="members")
    fcm_token = models.TextField(blank=True, null=True)
    profile_img = models.ImageField(
        upload_to=USER_PROFILE_IMAGE_MEDIA_FOLDER, blank=True, null=True
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.username
