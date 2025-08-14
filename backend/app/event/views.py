from rest_framework import viewsets
from event.models import Event
from event.serializers import EventsSerializer
from django.db.models import Q


class Events(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing events.
    '''
    serializer_class = EventsSerializer

    def get_queryset(self):
        # if user is anonymous, return only public events
        if not self.request.user.is_authenticated:
            return Event.objects.filter(visible=True, is_public=True)

        # if the user is part of the lead team, return all events
        is_staff = self.request.user.is_staff
        is_superuser = self.request.user.is_superuser
        if is_staff or is_superuser:
            return Event.objects.all()

        # return events visibles and public or
        # organized by one of the ligas that he belongs to.
        return Event.objects.filter(
            Q(visible=True) & (
                Q(is_public=True) | Q(ligas__in=self.request.user.ligas.all())
                )
            ).distinct()
