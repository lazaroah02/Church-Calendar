from rest_framework import serializers
from event.models import Event, Reservation
from datetime import timedelta
from django.utils.timezone import now
from django.db import models


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
            "groups",
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

        if attrs.get('created_by') is None:
            attrs['created_by'] = self.context['request'].user

        attrs['last_edit_by'] = self.context['request'].user    

        if attrs.get('start_time') and attrs.get('end_time') and attrs.get('start_time') >= attrs.get('end_time'):
            raise serializers.ValidationError("End time must be after start time.")
        return attrs


class ReservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"


class GroupByChoices(models.TextChoices):
    MONTH_DAYS = 'month_days', 'Month Days'


class EventParamsSerializer(serializers.Serializer):
    """
    ## Serializer for validating query parameters of Event view.

    **Fields:**
    - `start_date` (date, optional, required if group_by is set): Start of the date range.
    - `end_date` (date, optional, required if group_by is set): End of the date range.
    - `group_by` (choice, optional): Strategy for grouping events.
      Currently supported: 'month_days'.

    **Validations:**
    - If `group_by` is provided → `start_date` and `end_date` are required.
    - `start_date` must be strictly earlier than `end_date`.
    - The range must not exceed 1 month (31 days).
    """

    group_by = serializers.ChoiceField(
        choices=GroupByChoices.choices, required=False
    )
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

    def validate(self, data):
        group_by = data.get("group_by")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # If group_by is set, start_date and end_date are mandatory
        if group_by:
            if not start_date or not end_date:
                raise serializers.ValidationError({
                    "group_by": [
                        "start_date and end_date are required when group_by is specified."
                    ]
                })

        # If both dates are provided, validate them
        if start_date and end_date:
            delta = (end_date - start_date).days

            if delta < 1:
                raise serializers.ValidationError({
                    "start_date": ["start_date must be earlier than end_date."]
                })

            if group_by == GroupByChoices.MONTH_DAYS and delta > 31:
                raise serializers.ValidationError({
                    "end_date": ["The date range cannot exceed 31 days."]
                })

        return data
