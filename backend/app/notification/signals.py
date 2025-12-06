from event.models import Event
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from notification.utils.send_notifications import (
    send_push_notification_for_event
)
import logging

logger = logging.getLogger("notification")


@receiver(pre_save, sender=Event)
def check_cancellation_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    old = Event.objects.get(pk=instance.pk)

    instance._changed_is_canceled_state = (
        not old.is_canceled and instance.is_canceled
        )


@receiver(post_save, sender=Event)
def notify_about_canceled_event(sender, instance, created, **kwargs):
    """
    Notify users ONLY when an event changes from not canceled -> canceled.
    """
    if created:
        return

    try:
        if getattr(instance, "_changed_is_canceled_state", False):
            send_push_notification_for_event(
                event=instance,
                title="Evento Cancelado"
            )

    except Event.DoesNotExist:
        return

    except Exception as e:

        logger.error(
            f"Error sending cancellation notification for event {instance.id}-{instance.title}: {e}"
        )
