import logging
from rest_framework import viewsets
from liga.models import Liga
from liga.serializers import LigasSerializer
from user.permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger("liga")


class Ligas(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing ligas.
    '''
    queryset = Liga.objects.all()
    serializer_class = LigasSerializer


class LigasManagement(viewsets.ModelViewSet):
    '''
    A viewset for managing ligas.
    '''
    queryset = Liga.objects.all()
    serializer_class = LigasSerializer
    permission_class = [IsAuthenticated, IsSuperUser]

    def perform_create(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} created new liga with ID {instance.id} and name '{instance.name}'.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.save()
        logger.info(f"User {user} updated liga with ID {instance.id} and name '{instance.name}'.")

    def perform_destroy(self, instance):
        user = self.request.user
        logger.info(f"User {user} deleted liga with ID {instance.id} and name '{instance.name}'.")
        instance.delete()
