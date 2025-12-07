from django.core.management.base import BaseCommand
import logging
from notification.utils.send_notifications import (
    send_push_notification_for_today_events
    )

logger = logging.getLogger("notification")


class Command(BaseCommand):
    help = "This command sends a notification to the users about the events of the day"

    def handle(self, *args, **kwargs):
        self.stdout.write("Sending notifications ...")
        try:
            send_push_notification_for_today_events()
            self.stdout.write("Notifications sent successfully.")
        except Exception as e:
            self.stderr.write(f"Error occurred sending notifications: {e}")
            logger.error(
                f"Error occurred sending day's events notifications: {e}"
                )
