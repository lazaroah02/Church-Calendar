from rest_framework import viewsets
from events.models import Event
from events.serializers import EventsSerializer


class Events(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing events.
    '''
    queryset = Event.objects.all()
    serializer_class = EventsSerializer

