import logging
from rest_framework import viewsets
from church_group.models import GENERAL_GROUP_NAME, ChurchGroup
from church_group.serializers import (
    ChurchGroupsSerializer, ChurchGroupsManagementSerializer
    )
from user.permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import gettext
from django.contrib.auth import get_user_model

User = get_user_model()

logger = logging.getLogger("church_group")


class ChurchGroups(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing groups.
    '''
    queryset = ChurchGroup.objects.all()
    serializer_class = ChurchGroupsSerializer


class ChurchGroupsManagement(viewsets.ModelViewSet):
    '''
    A viewset for managing groups.
    '''
    queryset = ChurchGroup.objects.all()
    serializer_class = ChurchGroupsManagementSerializer
    permission_class = [IsAuthenticated, IsSuperUser]

    def perform_create(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} created new church group with ID {instance.id} and name '{instance.name}'.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} updated church group with ID {instance.id} and name '{instance.name}'.")

    def perform_destroy(self, instance):
        user = self.request.user
        logger.info(f"User {user} deleted church group with ID {instance.id} and name '{instance.name}'.")
        instance.delete()

    @action(methods=["DELETE"], detail=True)
    def bulk_remove_users_from_group(self, request, pk):
        try:
            ids_to_delete = request.data.get("users_to_remove")

            group = ChurchGroup.objects.get(id=pk)

            if group.name == GENERAL_GROUP_NAME:
                return Response(
                    {"message": gettext("You cannot remove users from the general group.")},
                    status=status.HTTP_400_BAD_REQUEST
                    )

            if not ids_to_delete:
                return Response(
                    {"message": gettext("Missing users_to_delete in query body")},
                    status=status.HTTP_400_BAD_REQUEST
                    )

            if not all(isinstance(id_, int) for id_ in ids_to_delete):
                return Response(
                    {"message": gettext("Invalid users IDs.")},
                    status=status.HTTP_400_BAD_REQUEST
                )

            group.members.remove(*ids_to_delete)

            return Response([], status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": gettext("Error on the request. Verify the group exists.")}, status=status.HTTP_400_BAD_REQUEST)
