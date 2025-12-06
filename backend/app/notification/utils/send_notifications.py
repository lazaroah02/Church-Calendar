from django.utils import timezone
import requests
from event.models import Event
from django.contrib.auth import get_user_model

User = get_user_model()

EXPO_URL = "https://exp.host/--/api/v2/push/send"


def send_push_notification_for_upcomming_events(
        datetime_lapse, data, title="Eventos Próximos"
        ):
    now = timezone.now()

    upcoming_events = (
        Event.objects
        .filter(
            start_time__gte=now,
            start_time__lte=datetime_lapse,
            visible=True,
            is_canceled=False,
        )
    )

    fcm_tokens = (
        User.objects
        .filter(member_groups__event__id__in=upcoming_events.values_list("id", flat=True))
        .exclude(fcm_token__isnull=True)
        .exclude(fcm_token="")
        .values_list("fcm_token", flat=True)
        .distinct()
    )

    for token in fcm_tokens:
        payload = {
            "to": token,
            "title": title,
            "body": build_events_notification_body(upcoming_events),
            "sound": "default",
            "priority": "high",
            "data": data
        }
        requests.post(EXPO_URL, json=payload)


def send_push_notification_for_today_events():
    '''
    This function sends push notifications for today's events.
    '''
    today = timezone.now()
    send_push_notification_for_upcomming_events(
        today.replace(hour=23, minute=59, second=59),
        title="Eventos de Hoy",
        data={
            "pathname": "/(tabs)/calendar",
            "params": {
                "selectedDayParam": {
                    "year": today.year,
                    "month": today.month,
                    "day": today.day,
                    "timestamp": int(today.timestamp() * 1000),
                    "dateString": today.strftime("%Y-%m-%d")
                    }
                }
            }
        )


def send_push_notification_for_event(event, title="Evento en Camino!"):
    '''
    This function sends a push notification for a specific event.
    '''
    fcm_tokens = (
        User.objects
        .filter(member_groups__event__id=event.id)
        .exclude(fcm_token__isnull=True)
        .exclude(fcm_token="")
        .values_list("fcm_token", flat=True)
        .distinct()
    )

    event_time = timezone.localtime(event.start_time)

    for token in fcm_tokens:
        payload = {
            "to": token,
            "title": title,
            "body": f"{event_time.strftime('%I:%M %p').lower()} {event.title}\n{event_time.strftime("%d-%m-%Y")}",
            "sound": "default",
            "priority": "high",
            "data": {
                "pathname": "/(tabs)/calendar",
                "params": {
                    "selectedDayParam": {
                        "year": event_time.year,
                        "month": event_time.month,
                        "day": event_time.day,
                        "timestamp": int(event_time.timestamp() * 1000),
                        "dateString": event_time.strftime("%Y-%m-%d")
                        }
                    }
            }
        }

        requests.post(EXPO_URL, json=payload)


def build_events_notification_body(events):
    body = ""

    for event in events:
        body += f"{timezone.localtime(event.start_time).strftime('%I:%M %p').lower()} {event.title}\n"

    return body
