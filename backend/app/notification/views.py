from time import time
from django.contrib.auth import get_user_model
from notification.utils.send_notifications import (
    send_notification_to_everyone,
    send_push_notification_for_event,
    send_push_notification_for_upcomming_events,
    )
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils.translation import gettext as _
from event.models import Event
import logging
from django.utils import timezone
from datetime import timezone as dt_timezone
import pytz

User = get_user_model()
logger = logging.getLogger("notification")


class UserNotificationTokenView(APIView):
    """
    View to handle user notification tokens.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Handle GET request to retrieve user notification token and timezone.
        """
        user = User.objects.get(id=request.user.id)
        fcm_token = getattr(user, 'fcm_token', None)
        timezone = getattr(user, 'timezone', None)

        return Response({'fcm_token': fcm_token, 'timezone':timezone}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to save or update user notification token and timezone.
        """
        user = User.objects.get(id=request.user.id)
        new_fcm_token = request.data.get('fcm_token')
        new_timezone = request.data.get('timezone')

        if not new_fcm_token:
            return Response(
                {'error': _('Notification Token is required.')},
                status=status.HTTP_400_BAD_REQUEST
                )

        if not new_timezone:
            return Response(
                {'error': _('Timezone is required.')},
                status=status.HTTP_400_BAD_REQUEST
                )

        # Save or update the token in the database
        user.fcm_token = new_fcm_token
        user.timezone = new_timezone
        user.save()

        return Response(
            {
                'message': _('Notification Token and timezone saved successfully.'),
                'fcm_token': new_fcm_token,
                'timezone': new_timezone
            },
            status=status.HTTP_200_OK
            )


class SendNotificationAboutEvent(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to send notifications to users about an event.
        """
        event_id = request.data.get('event_id')
        if not event_id:
            return Response(
                {'error': _('Event ID is required.')},
                status=status.HTTP_400_BAD_REQUEST
                )
        event = Event.objects.filter(id=event_id).first()
        if not event:
            return Response(
                {'error': _('Event not found.')},
                status=status.HTTP_404_NOT_FOUND
                )
        try:
            send_push_notification_for_event(event)
            logger.info(f"Notification sent for event {event_id} by user {request.user}")
            return Response(
                {'message': _('Notification sent successfully.')},
                status=status.HTTP_200_OK
                )
        except Exception as e:
            logger.error(f"Error sending notification for event {event_id}: {e}")
            return Response(
                {"error": _('Failed to send notification. Try again later ')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class CheckForUpcommingEventsAndNotify(APIView):
    """
    View to check for upcoming events and notify users.
    """

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to check for upcoming events and notify users.
        """

        # Extract minutes or default to 60
        minutes = request.data.get("minutes", 60)

        # Validate integer input
        try:
            minutes = int(minutes)
        except (ValueError, TypeError):
            return Response(
                {"error": _("The 'minutes' field must be a valid integer.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Havana timezone
            havana_tz = pytz.timezone("America/Havana")

            # Convert current UTC time to Havana local time
            now_havana = timezone.now().astimezone(havana_tz)

            # Add the minutes in Havana timezone
            lapse_havana = now_havana + timezone.timedelta(minutes=minutes)

            # Convert the local lapse back to UTC for DB filtering
            datetime_lapse_utc = lapse_havana.astimezone(dt_timezone.utc)

            # Make the call exactly like your management command
            send_push_notification_for_upcomming_events(
                datetime_lapse=datetime_lapse_utc,
                data=request.data.get("data", {})
            )

            logger.info(
                f"Checked for upcoming events and sent notifications by user {request.user}"
            )

            return Response(
                {"message": _("Checked for upcoming events and sent notifications successfully.")},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Error checking for upcoming events: {e}")
            return Response(
                {"error": _("Failed to check for upcoming events. Try again later.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotifyEveryone(APIView):
    """
    View to notify about something to all the users.
    """

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to notify everyone.
        """

        # Extract params
        title = request.data.get("title", "")
        body = request.data.get("body", "")
        data = request.data.get("data", "{}")

        try:
            send_notification_to_everyone(
                title=title,
                body=body,
                data=data
            )

            logger.info(
                f"Notification sent to every user by user {request.user}"
            )

            return Response(
                {"message": _("Notification sent to everyone.")},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Error sending notification: {e}")
            return Response(
                {"error": _("Failed sending notification. Try again later.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )