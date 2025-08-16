import logging
from rest_framework import viewsets
from church_group.models import ChurchGroup
from church_group.serializers import (
    ChurchGroupsSerializer, ChurchGroupsManagementSerializer
    )
from user.permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated

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
