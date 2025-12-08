from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timezone as dt_timezone
import pytz
import logging
from notification.utils.send_notifications import (
    send_push_notification_for_upcomming_events
)

logger = logging.getLogger("notification")


class Command(BaseCommand):
    help = "This command sends a notification to the users about the upcoming events"

    def add_arguments(self, parser):
        # Example: receive a `minutes` parameter
        parser.add_argument(
            "--minutes",
            type=int,
            default=60,
            help="Time in minutes ahead to search for events"
        )

        # Example: receive a JSON string
        parser.add_argument(
            "--data",
            type=str,
            default="{}",
            help="JSON data sent with the notification"
        )

    def handle(self, *args, **kwargs):
        minutes = kwargs["minutes"]
        data = kwargs["data"]

        self.stdout.write(f"Searching events within {minutes} minutes...")

        try:
            # Havana timezone
            havana_tz = pytz.timezone("America/Havana")

            # Convert current UTC time to Havana time
            now_havana = timezone.now().astimezone(havana_tz)

            # Add minutes in Havana's local time
            lapse_havana = now_havana + timezone.timedelta(minutes=minutes)

            # Convert lapse back to UTC for database filtering
            datetime_lapse_utc = lapse_havana.astimezone(dt_timezone.utc)

            # Send notifications using the converted UTC time
            send_push_notification_for_upcomming_events(
                datetime_lapse=datetime_lapse_utc,
                data=data
            )

            self.stdout.write("Notifications sent successfully.")

        except Exception as e:
            self.stderr.write(f"Error occurred sending notifications: {e}")
            logger.error(
                f"Error occurred sending upcoming events notifications: {e}"
            )
