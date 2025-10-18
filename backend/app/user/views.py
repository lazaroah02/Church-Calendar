import logging
from django.utils.translation import gettext as _
from user.paginators import UsersPagination
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from user.serializers import UserManagmentSerializer
from user.utils.utils import validate_password
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsSuperUser
from user.utils.bulk_operations import handle_bulk_delete

User = get_user_model()

logger = logging.getLogger("user")


class UsersManagment(viewsets.ModelViewSet):
    """
    ## ViewSet for managing users.

    Supports:
        - Filtering
        - Searching
        - Ordering
        - Bulk operations (delete multiple users, change password)

    **To delete multiple users (DELETE to /api/users/manage/):**

        {
            "users_to_delete": [1, 2, 3]
        }

    **To change a user's password (PUT to /api/users/manage/{id}/change_password/):**

        {
            "new_password": "your_new_password"
        }

    Required permissions: [IsAuthenticated, IsAdminUser]
    """
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all()
    serializer_class = UserManagmentSerializer
    pagination_class = UsersPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id', "is_active", "is_staff", "is_superuser"]
    search_fields = ["full_name", "email", "username"]

    def perform_create(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} created new user with ID {instance.id} and username '{instance.username}'.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} updated user with ID {instance.id} and username '{instance.username}'.")

    def perform_destroy(self, instance):
        user = self.request.user
        logger.info(f"User {user} deleted user with ID {instance.id} and username '{instance.username}'.")
        instance.delete()

    @action(methods=["DELETE"], detail=False)
    def bulk_delete_users(self, request):
        return handle_bulk_delete(
            request,
            user=request.user,
            ids_field_name="users_to_delete",
            model=User,
            log_name="users"
            )

    @action(methods=["PUT"], detail=True)
    def change_password(self, request, pk):
        try:
            password = request.data["new_password"]
            try:
                validated_password = validate_password(password)
                user_to_change = User.objects.get(id=pk)
                user_to_change.set_password(validated_password)
                user_to_change.save()
                logger.info(f"User {request.user} changed password for user ID {pk}.")
                return Response([], status=status.HTTP_200_OK)
            except ValidationError as e:
                logger.warning(f"User {request.user} provided invalid password for change_password on user ID {pk}: {e.messages}")
                return Response({"password": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Password was not provided or other error during change_password by user {request.user} for user ID {pk}: {e}", exc_info=True)
            return Response(
                {"message": _("Password was not provided")},
                status=status.HTTP_400_BAD_REQUEST
            )
