from django.core.management.base import BaseCommand
import logging
from notification.utils.send_notifications import (
    send_notification_to_everyone
)

logger = logging.getLogger("notification")


class Command(BaseCommand):
    help = "This command sends a notification to all users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--title",
            type=str,
            default="",
            help="Title of notification"
        )
        parser.add_argument(
            "--body",
            type=str,
            default="",
            help="Body of notification"
        )
        parser.add_argument(
            "--data",
            type=str,
            default={},
            help="JSON data sent with the notification"
        )

    def handle(self, *args, **kwargs):
        title = kwargs["title"]
        body = kwargs["body"]
        data = kwargs["data"]

        try:

            # Send notifications using the converted UTC time
            send_notification_to_everyone(
                title=title,
                body=body,
                data=data
            )

            self.stdout.write("Notifications sent successfully.")

        except Exception as e:
            self.stderr.write(f"Error occurred sending notifications: {e}")
            logger.error(
                f"Error occurred sending a notification to everyone: {e}"
            )
