from django.utils import timezone
import pytz
import requests
from event.models import Event
from django.contrib.auth import get_user_model
from datetime import timezone as dt_timezone

User = get_user_model()

EXPO_URL = "https://exp.host/--/api/v2/push/send"


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
#  NOTIFY ABOUT UPCOMING EVENTS
# ===========================

def send_push_notification_for_upcomming_events(
        title="Eventos Próximos",
        data={},
        datetime_lapse=timezone.now() + timezone.timedelta(minutes=60)
        ):
    now = timezone.now()

    upcoming_events = Event.objects.filter(
        start_time__gte=now,
        start_time__lte=datetime_lapse,
        visible=True,
        is_canceled=False,
    )

    print(f"{upcoming_events.count()} upcoming events found.")

    # GET USERS TO NOTIFY
    users = (
        User.objects
        .filter(member_groups__event__id__in=upcoming_events.values_list("id"))
        .exclude(fcm_token__isnull=True)
        .exclude(fcm_token="")
        .distinct()
    )

    print(f"Sending notifications to {users.count()} devices.")

    for user in users:
        event_body = build_events_notification_body_for_user(
            upcoming_events, user.timezone
        )

        payload = {
            "to": user.fcm_token,
            "title": title,
            "body": event_body,
            "sound": "default",
            "priority": "high",
            "data": data
        }

        requests.post(EXPO_URL, json=payload)


# ===========================
#  TODAY EVENTS NOTIFICATION
# ===========================

def send_push_notification_for_today_events():
    # Convert current UTC time to Havana timezone
    havana_tz = pytz.timezone("America/Havana")
    today_havana = timezone.now().astimezone(havana_tz)

    # End of the day in Havana time
    end_of_day_havana = today_havana.replace(
        hour=23,
        minute=59,
        second=59,
        microsecond=0
    )

    # Send notifications for events happening today (Havana time)
    send_push_notification_for_upcomming_events(
        title="Eventos de Hoy",
        data={
            "pathname": "/(tabs)/calendar",
            # "params": {
            #     "selectedDayParam": {
            #         "year": today_havana.year,
            #         "month": today_havana.month,
            #         "day": today_havana.day,
            #         # Convert to milliseconds for frontend
            #         "timestamp": int(today_havana.timestamp() * 1000),
            #         "dateString": today_havana.strftime("%Y-%m-%d")
            #     }
            # }
        },
        # Convert end-of-day Havana time back to UTC for database filtering
        datetime_lapse=end_of_day_havana.astimezone(dt_timezone.utc)
    )


# ===========================
#  NOTIFY ABOUT A SPECIFIC EVENT
# ===========================

def send_push_notification_for_event(event, title="Evento en Camino!"):
    users = (
        User.objects
        .filter(member_groups__event__id=event.id)
        .exclude(fcm_token__isnull=True)
        .exclude(fcm_token="")
        .distinct()
    )

    for user in users:
        event_time_user = convert_event_time_for_user(
            event.start_time, user.timezone
        )

        payload = {
            "to": user.fcm_token,
            "title": title,
            "body": f"{event_time_user.strftime('%I:%M %p').lower()} {event.title}\n"
                    f"{event_time_user.strftime('%d-%m-%Y')}",
            "sound": "default",
            "priority": "high",
            "data": {
                "pathname": "/(tabs)/calendar",
                # "params": {
                #     "selectedDayParam": {
                #         "year": event_time_user.year,
                #         "month": event_time_user.month,
                #         "day": event_time_user.day,
                #         "timestamp": int(event_time_user.timestamp() * 1000),
                #         "dateString": event_time_user.strftime("%Y-%m-%d")
                #     }
                # }
            }
        }

        requests.post(EXPO_URL, json=payload)


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
