from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from reservation.serializers import ReservationsSerializer
from reservation.models import Reservation


class ManageReservations(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ReservationsSerializer
    queryset = Reservation.objects.all() 