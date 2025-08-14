from rest_framework import viewsets
from event.models import Event
from event.serializers import EventsSerializer, ManageEventsSerializer
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class Events(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing events.
    '''
    serializer_class = EventsSerializer

    def get_queryset(self):
        # if user is anonymous, return only public events
        if not self.request.user.is_authenticated:
            return Event.objects.filter(visible=True, is_public=True)

        # return events visibles and public or
        # organized by one of the ligas that he belongs to.
        return Event.objects.filter(
            Q(visible=True) & (
                Q(is_public=True) | Q(ligas__in=self.request.user.ligas.all())
                )
            ).distinct()


class ManageEvents(viewsets.ModelViewSet):
    '''
    A viewset for managing events.
    '''
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ManageEventsSerializer
    queryset = Event.objects.all()

