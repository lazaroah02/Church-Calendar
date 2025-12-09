from reservation.paginators import ReservationsPagination
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from reservation.serializers import ReservationsSerializer
from reservation.models import Reservation
from django_filters.rest_framework import DjangoFilterBackend


class ManageReservations(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ReservationsSerializer
    pagination_class = ReservationsPagination
    queryset = Reservation.objects.all()
    filter_backends = [
        filters.SearchFilter, DjangoFilterBackend
        ]
    filterset_fields = ['event']
    search_fields = ['user__full_name', 'user__email', 'event__username']
