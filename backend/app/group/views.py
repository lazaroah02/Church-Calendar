import logging
from rest_framework import viewsets
from group.models import Group
from group.serializers import GroupsSerializer
from user.permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger("group")


class Groups(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing groups.
    '''
    queryset = Group.objects.all()
    serializer_class = GroupsSerializer


class GroupsManagement(viewsets.ModelViewSet):
    '''
    A viewset for managing groups.
    '''
    queryset = Group.objects.all()
    serializer_class = GroupsSerializer
    permission_class = [IsAuthenticated, IsSuperUser]

    def perform_create(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} created new group with ID {instance.id} and name '{instance.name}'.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} updated group with ID {instance.id} and name '{instance.name}'.")

    def perform_destroy(self, instance):
        user = self.request.user
        logger.info(f"User {user} deleted group with ID {instance.id} and name '{instance.name}'.")
        instance.delete()
