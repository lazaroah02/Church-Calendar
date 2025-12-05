from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext as _

User = get_user_model()


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
