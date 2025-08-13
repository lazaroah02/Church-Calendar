from rest_framework import viewsets
from event.models import Event
from event.serializers import EventsSerializer


class Events(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing events.
    '''
    queryset = Event.objects.all()
    serializer_class = EventsSerializer
