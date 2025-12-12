from datetime import datetime
from rest_framework import response, status
from event.serializers import EventParamsSerializer, GroupByChoices
from event.utils.group_events import group_by_month_days
import pytz


class EventListMixin:
    """
    Mixin providing reusable logic for listing event objects with
    optional timezone-aware date filtering, grouping, and pagination.

    ## Overview
    This mixin centralizes the logic used by event list endpoints
    to handle:

    - Validation of query parameters
    - Conversion of date ranges from the client's timezone to UTC
    - Filtering events by a timezone-adjusted date interval
    - Optional grouping of events by day of the month
    - Paginated or non-paginated responses

    It assumes that:
    - Event timestamps (`start_time`, `end_time`) are stored in UTC
    - The client may supply a `timezone` parameter indicating its local timezone
    - Events may span multiple days, and should appear under each relevant date
    """

    def filter_and_respond(self, request, base_queryset):
        """
        Applies validated query parameters to an event queryset and returns
        a properly formatted DRF response.

        ## Parameters
        - **request** (`Request`):
            The incoming DRF request containing query parameters:
            - `start_date`: Start of the date range (YYYY-MM-DD)
            - `end_date`: End of the date range (YYYY-MM-DD)
            - `timezone`: Optional timezone name (e.g. "America/Havana")
            - `group_by`: Optional grouping mode (e.g. "month_days")

        - **base_queryset** (`QuerySet`):
            A prefetched queryset of events, already filtered for visibility,
            permissions, and group membership.

        ## Timezone Handling
        Events are stored in UTC, but the user selects dates in **their own timezone**.
        To ensure correct filtering:
        1. The provided `start_date` and `end_date` are interpreted as **local dates**
           at midnight and 23:59:59 respectively.
        2. These local datetimes are converted into UTC.
        3. The queryset is filtered using these UTC boundaries.

        This ensures:
        - Events crossing midnight appear on the correct local day
        - Events near timezone boundaries are not incorrectly excluded
        - Month views behave consistently in all timezones

        ## Filtering Behavior
        The filtering is inclusive and selects events where:

            event.start_time <= end_utc
            AND
            event.end_time >= start_utc

        This catches:
        - Events fully inside the range
        - Events that overlap from before
        - Events that extend beyond the range
        - Multi-day events

        ## Grouping Behavior (`group_by=month_days`)
        When this mode is enabled:
        - Pagination is disabled
        - The queryset is passed to `group_by_month_days`
        - Events are grouped by their **local date**, not UTC
        - Events spanning multiple days appear under each applicable day

        ## Returns
        - A DRF `Response` with:
            - A dictionary keyed by date (if grouped)
            - A paginated list of events (default)
            - A flat list of events (if pagination disabled)

        ## Raises
        - `ValidationError` if query parameters fail validation
        - Converts invalid or unknown timezone names to UTC safely
        """

        # Validate query parameters (including timezone and date range)
        serializer = EventParamsSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        group_by = serializer.validated_data.get("group_by")
        start_date = serializer.validated_data.get("start_date")
        end_date = serializer.validated_data.get("end_date")
        tz_name = serializer.validated_data.get("timezone", "UTC")

        # Obtain a valid timezone object (fallback to UTC)
        try:
            tz = pytz.timezone(tz_name)
        except Exception:
            tz = pytz.UTC

        # Convert the user's date range (local) → timezone-aware datetimes
        start_dt_local = tz.localize(
            datetime.combine(start_date, datetime.min.time())
            )
        end_dt_local = tz.localize(
            datetime.combine(end_date, datetime.max.time())
            )

        # Convert the local interval → UTC for database filtering
        start_utc = start_dt_local.astimezone(pytz.UTC)
        end_utc = end_dt_local.astimezone(pytz.UTC)

        qs = base_queryset

        # Apply timezone-adjusted filtering
        if start_date and end_date:
            qs = qs.filter(
                start_time__lte=end_utc,
                end_time__gte=start_utc
            )

        # Non-paginated response: group events by days in the user's timezone
        if group_by == GroupByChoices.MONTH_DAYS:
            grouped = group_by_month_days(qs, self.get_serializer_class(), tz=tz)
            return response.Response(grouped, status=status.HTTP_200_OK)

        # Paginated response
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Flat (non-paginated) response
        serializer = self.get_serializer(qs, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
