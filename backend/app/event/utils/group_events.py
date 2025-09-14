from collections import defaultdict
from datetime import timedelta


def group_by_month_days(queryset, serializer_class):
    """
    Groups events by individual days.

    Each key is a date in ISO format (YYYY-MM-DD),
    and the value is a list of events occurring on that date.
    Events spanning multiple days will appear under each day.

    Example:
    {
        "2025-09-09": [...],
        "2025-09-10": [...]
    }
    """
    data = defaultdict(list)

    for event in queryset:
        current_day = event.start_time.date()
        last_day = event.end_time.date()

        while current_day <= last_day:
            key = current_day.isoformat()
            data[key].append(serializer_class(event).data)
            current_day += timedelta(days=1)

    return data
