from django.db import models
from django.contrib.auth import get_user_model
from church_group.models import ChurchGroup

EVENT_IMAGES_FOLDER = 'event_images'


class Event(models.Model):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    img = models.ImageField(upload_to=EVENT_IMAGES_FOLDER, blank=True, null=True)
    description = models.TextField(blank=True, default="")
    location = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        related_name='events',
        null=True,
        blank=True
    )
    last_edit_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        related_name='events_edited',
        null=True,
        blank=True
    )
    groups = models.ManyToManyField(ChurchGroup, blank=True)
    visible = models.BooleanField(default=True)
    is_canceled = models.BooleanField(default=False)
    open_to_reservations = models.BooleanField(default=True)

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
