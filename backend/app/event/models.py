from django.db import models
from django.contrib.auth import get_user_model
from liga.models import Liga


class Event(models.Model):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True, default="")
    location = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        related_name='events',
        null=True,
        blank=True
    )
    ligas = models.ManyToManyField(Liga, blank=True)
    is_public = models.BooleanField(default=True)
    visible = models.BooleanField(default=True)
    is_canceled = models.BooleanField(default=False)
    open_to_reservations = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Reservation(models.Model):
    occurrence = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='reservations'
    )
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation by {self.user} for {self.occurrence}"

