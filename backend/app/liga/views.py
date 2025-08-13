from rest_framework import viewsets
from liga.models import Liga
from liga.serializers import LigasSerializer


class Ligas(viewsets.ReadOnlyModelViewSet):
    '''
    A viewset for viewing ligas.
    '''
    queryset = Liga.objects.all()
    serializer_class = LigasSerializer
