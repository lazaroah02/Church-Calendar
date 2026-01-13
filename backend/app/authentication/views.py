from dj_rest_auth.views import LoginView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from authentication.serializers import CustomUserDetailsSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(LoginView):
    """
        ## Custom login view

        Extends dj-rest-auth's LoginView to return additional user information along with the authentication token.

        Example response on successful login:

            {
                "token": "Auth token
                "user_info": {
                    "id": 1,
                    "email": "user@example.com",
                    "username": "user",
                    "full_name": "Full Name",
                    "is_staff": false,
                    "is_active": true
                }
            }

        - The `token` field contains the authentication token.
        - The `user_info` field includes relevant information about the authenticated user.

        Required permissions: None (standard login endpoint)
    """

    def get_response(self):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user_instance = serializer.validated_data["user"]

        user_serializer = CustomUserDetailsSerializer(
            user_instance,
            context={"request": self.request}
        )
        original_response = super().get_response()

        data = {
            "token": original_response.data.get("key"),
            "user_info": user_serializer.data
        }

        return Response(data)
