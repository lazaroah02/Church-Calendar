from django.contrib.auth import get_user_model
from notification.utils.send_notifications import (
    send_push_notification_for_event,
    )
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils.translation import gettext as _
from event.models import Event
import logging

User = get_user_model()
logger = logging.getLogger("notification")


class UserNotificationTokenView(APIView):
    """
    View to handle user notification tokens.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Handle GET request to retrieve user notification token.
        """
        user = User.objects.get(id=request.user.id)
        fcm_token = getattr(user, 'fcm_token', None)

        return Response({'fcm_token': fcm_token}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to save or update user notification token.
        """
        user = User.objects.get(id=request.user.id)
        new_fcm_token = request.data.get('fcm_token')

        if not new_fcm_token:
            return Response(
                {'error': _('Notification Token is required.')},
                status=status.HTTP_400_BAD_REQUEST
                )

        # Save or update the token in the database
        user.fcm_token = new_fcm_token
        user.save()

        return Response(
            {
                'message': _('Notification Token saved successfully.'),
                'fcm_token': new_fcm_token
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
