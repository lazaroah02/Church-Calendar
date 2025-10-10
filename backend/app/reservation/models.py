from django.db import models
from event.models import Event
from django.contrib.auth import get_user_model

# Create your models here.

class Reservation(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='reservations'
    )
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation by {self.user} for {self.event}"