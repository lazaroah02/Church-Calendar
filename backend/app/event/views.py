from rest_framework import viewsets
from event.models import Event
from event.serializers import EventsSerializer, ManageEventsSerializer
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from church_group.models import ChurchGroup, GENERAL_GROUP_NAME


class Events(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing events.
    '''
    serializer_class = EventsSerializer

    def get_queryset(self):
        # if user is anonymous, return only events for group general
        if not self.request.user.is_authenticated:
            general_group = ChurchGroup.objects.get(name=GENERAL_GROUP_NAME)
            return Event.objects.filter(
                visible=True,
                groups__in=[general_group]
                )

        # return events visibles and
        # organized by one of the groups that the user belongs to.
        return Event.objects.filter(
            Q(visible=True) &
            Q(groups__in=self.request.user.member_groups.all())
            ).distinct()


class ManageEvents(viewsets.ModelViewSet):
    '''
    A viewset for managing events.
    '''
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ManageEventsSerializer
    queryset = Event.objects.all()
