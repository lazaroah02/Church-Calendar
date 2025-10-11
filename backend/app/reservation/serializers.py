from authentication.serializers import CustomUserDetailsSerializer
from rest_framework import serializers
from reservation.models import Reservation


class ReservationsSerializer(serializers.ModelSerializer):
    user_full_info = CustomUserDetailsSerializer(source="user", read_only=True)

    class Meta:
        model = Reservation
        fields = "__all__"
        extra_fields = ["user_full_info"]
