from django.db import models
from django.contrib.auth import get_user_model
from liga.models import Liga


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        related_name='events',
        null=True,
        blank=True
    )
    liga = models.ForeignKey(
        Liga, on_delete=models.CASCADE, null=True, blank=True
        )
    is_public = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Reservation(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='reservations'
        )
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation by {self.user} for {self.event}"
