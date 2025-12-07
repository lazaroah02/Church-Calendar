from collections import defaultdict
from datetime import timedelta


def group_by_month_days(queryset, serializer_class, tz=None):
    """
    Groups events by individual days in the given timezone.

    Each key is a date in ISO format (YYYY-MM-DD),
    and the value is a list of events occurring on that date.
    Events spanning multiple days appear under each day.

    :param tz: pytz timezone object. Defaults to UTC if None.
    """
    if tz is None:
        import pytz
        tz = pytz.UTC

    data = defaultdict(list)

    for event in queryset:
        # Convert start and end times to the desired timezone
        start_local = event.start_time.astimezone(tz).date()
        end_local = event.end_time.astimezone(tz).date()

        current_day = start_local
        while current_day <= end_local:
            key = current_day.isoformat()
            data[key].append(serializer_class(event).data)
            current_day += timedelta(days=1)

    return dict(data)
