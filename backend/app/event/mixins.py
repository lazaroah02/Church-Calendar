from rest_framework import response, status
from event.serializers import EventParamsSerializer, GroupByChoices
from event.utils.group_events import group_by_month_days


class EventListMixin:
    """
    Shared logic for listing events, supporting grouping and pagination.
    """

    def filter_and_respond(self, request, base_queryset):
        serializer = EventParamsSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        group_by = serializer.validated_data.get("group_by")
        start_date = serializer.validated_data.get("start_date")
        end_date = serializer.validated_data.get("end_date")

        qs = base_queryset

        # Apply date filtering
        if start_date and end_date:
            qs = qs.filter(
                start_time__date__lte=end_date,
                end_time__date__gte=start_date
            )

        # Grouped response (no pagination)
        if group_by == GroupByChoices.MONTH_DAYS:
            grouped = group_by_month_days(qs, self.get_serializer_class())
            return response.Response(grouped, status=status.HTTP_200_OK)

        # Flat response (with pagination)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)