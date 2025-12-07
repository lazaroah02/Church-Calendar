from rest_framework import serializers
from event.models import Event
from django.db import models
from church_group.serializers import ChurchGroupsReducedSerializer
from authentication.serializers import CustomUserDetailsSerializer
import pytz
from django.utils.translation import gettext_lazy as _


class EventsSerializer(serializers.ModelSerializer):
    groups_full_info = ChurchGroupsReducedSerializer(many=True, source="groups", read_only=True)
    created_by_full_info = CustomUserDetailsSerializer(source="created_by", read_only=True)

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
            "last_edit_by",
            "groups",
            "is_canceled",
            "visible",
            "open_to_reservations",
            "reservations_limit",
            "created_at",
            "updated_at",
            "groups_full_info",
            "created_by_full_info"
        ]


class ManageEventsSerializer(serializers.ModelSerializer):
    last_edit_by = serializers.PrimaryKeyRelatedField(read_only=True)
    groups_full_info = ChurchGroupsReducedSerializer(many=True, source="groups", read_only=True)
    created_by_full_info = CustomUserDetailsSerializer(source="created_by", read_only=True)
    last_edit_by_full_info = CustomUserDetailsSerializer(source="last_edit_by", read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
        extra_fields = ["groups_full_info", "created_by_full_info", "last_edit_by_full_info"]

    def validate(self, attrs):

        # if is a creation
        if attrs.get('created_by') is None and self.instance is None:
            attrs['created_by'] = self.context['request'].user

        attrs['last_edit_by'] = self.context['request'].user

        if attrs.get('start_time') and attrs.get('end_time') and attrs.get('start_time') >= attrs.get('end_time'):
            raise serializers.ValidationError("End time must be after start time.")
        return attrs


class GroupByChoices(models.TextChoices):
    MONTH_DAYS = 'month_days', 'Month Days'


class EventParamsSerializer(serializers.Serializer):
    """
    Serializer for validating query parameters of Event view.

    Fields:
    - `start_date` (date, optional, required if group_by is set): Start of the date range.
    - `end_date` (date, optional, required if group_by is set): End of the date range.
    - `group_by` (choice, optional): Strategy for grouping events.
      Currently supported: 'month_days'.
    - `timezone` (string, optional): IANA timezone name (e.g., "America/Havana").
      Defaults to "UTC" if not provided or invalid.
    """

    group_by = serializers.ChoiceField(
        choices=GroupByChoices.choices, required=False
    )
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    timezone = serializers.CharField(required=False, default="UTC")

    def validate_timezone(self, value):
        """
        Validate that the timezone is a valid IANA timezone.
        Defaults to UTC if invalid.
        """
        try:
            pytz.timezone(value)
        except Exception:
            raise serializers.ValidationError(_("Invalid timezone"))
        return value

    def validate(self, data):
        group_by = data.get("group_by")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # If group_by is set, start_date and end_date are mandatory
        if group_by:
            if not start_date or not end_date:
                raise serializers.ValidationError({
                    "group_by": [
                        _("start_date and end_date are required when group_by is specified.")
                    ]
                })

        # If both dates are provided, validate them
        if start_date and end_date:
            delta = (end_date - start_date).days

            if delta < 0:
                raise serializers.ValidationError({
                    "start_date": [_("start_date must be earlier than end_date.")]
                })

            if group_by == GroupByChoices.MONTH_DAYS and delta > 31:
                raise serializers.ValidationError({
                    "end_date": [_("The date range cannot exceed 31 days.")]
                })

        return data

