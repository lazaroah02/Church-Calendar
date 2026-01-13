from django.db import models
from django.contrib.auth import get_user_model
import notification.signals

User = get_user_model()


class DevicePushToken(models.Model):
    PLATFORM_CHOICES = (
        ("android", "Android"),
        ("ios", "iOS"),
    )

    TYPE_CHOICES = (
        ("fcm", "FCM"),
        ("apns", "APNs"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="devices_push_notification_info")
    fcm_token = models.TextField(unique=True, blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, default="America/Havana")
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
