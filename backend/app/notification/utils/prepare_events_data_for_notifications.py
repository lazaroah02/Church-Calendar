import pytz


# ===========================
#  USER TIMEZONE CONVERSION
# ===========================
def convert_event_time_for_user(event_time, user_timezone):
    """
    Convierte event_time al timezone del usuario usando pytz.
    """
    try:
        tz = pytz.timezone(user_timezone)
    except Exception:
        tz = pytz.timezone("UTC")

    return event_time.astimezone(tz)


# ===========================
#  EVENT DATE INTERVAL
# ===========================
def get_event_date_interval_string(event, timezone_str):
    """
    Docstring for get_event_date_interval_string
    This function returns a string representing the date interval of an event
    in the user's timezone. If the event starts and ends on the same day, it returns
    that single date. If the event spans multiple days, it returns a range of dates.

    :param event: Event object
    :param timezone_str: User timezone string
    """
    start_date_str = convert_event_time_for_user(
            event.start_time, timezone_str
        ).strftime("%d-%m-%Y")
    end_date_str = convert_event_time_for_user(
        event.end_time, timezone_str
    ).strftime("%d-%m-%Y")

    if start_date_str == end_date_str:
        return start_date_str
    else:
        return f"{start_date_str} - {end_date_str}"


# ===========================
#  BODY BUILD FOR NOTIFICATIONS
# ===========================
def build_events_notification_body_for_user(events, user_timezone):
    body = ""

    for event in events:
        event_time_user = convert_event_time_for_user(
            event.start_time, user_timezone
        )
        body += f"{event_time_user.strftime('%I:%M %p').lower()} {event.title}\n"

    return body
