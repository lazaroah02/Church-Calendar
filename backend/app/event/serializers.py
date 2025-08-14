from rest_framework import serializers
from event.models import Event, Reservation


class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "start_time",
            "end_time",
            "img",
            "description",
            "location",
            "created_by",
            "ligas",
            "is_public",
            "is_canceled",
            "visible",
            "open_to_reservations",
            "created_at",
            "updated_at"
        ]


class ManageEventsSerializer(serializers.ModelSerializer):
    last_edit_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = "__all__"

    def validate(self, attrs):

        if attrs['created_by'] is None:
            attrs['created_by'] = self.context['request'].user

        attrs['last_edit_by'] = self.context['request'].user    

        if attrs['start_time'] >= attrs['end_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return attrs


class ReservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"
