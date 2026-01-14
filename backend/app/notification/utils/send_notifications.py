import json
import logging
from django.utils import timezone
import pytz
from notification.firebase import get_firebase_app
from event.models import Event
from django.contrib.auth import get_user_model
from datetime import timezone as dt_timezone
from firebase_admin import messaging, exceptions
from django.db.models import Q

User = get_user_model()
logger = logging.getLogger("notification")


# ************CURRENTLY ONLY ANDROID IS SUPPORTED************
# ****Support up to 500 devices per request.
# For a higher amount, check messaging.send_each_for_multicast*************

# ===========================
#  NOTIFY ABOUT UPCOMING EVENTS
# ===========================
def send_push_notification_for_upcomming_events(
        title="Eventos Próximos",
        data={},
        datetime_lapse=timezone.now() + timezone.timedelta(minutes=60)
        ):

    from notification.models import DevicePushToken
    get_firebase_app()
    now = timezone.now()

    now_time = now.time()
    lapse_time = datetime_lapse.time()

    upcoming_events = Event.objects.filter(
        # --- CONDICIONES GENERALES ---
        visible=True,
        is_canceled=False,
    ).filter(
        # --- LÓGICA DE TIEMPO (Caso A o Caso B) ---
        Q(
            # Caso A: Eventos que empiezan exactamente hoy dentro del rango
            start_time__gte=now,
            start_time__lte=datetime_lapse
        ) |
        Q(
            start_time__date__lte=now,
            end_time__date__gte=now,
            start_time__time__gte=datetime_lapse.time(),
        )
    )

    print(f"{upcoming_events.count()} upcoming events found.")

    # GET DEVICES TO NOTIFY
    devices = (
        DevicePushToken.objects
        .filter(user__member_groups__event__id__in=upcoming_events.values_list("id", flat=True))
        .distinct()
    )

    print(f"Sending notifications to {devices.count()} devices.")

    for device in devices:
        user_events = upcoming_events.filter(
            groups__in=device.user.member_groups.all()
            ).distinct()
        event_body = build_events_notification_body_for_user(
            user_events, device.timezone
        )

        if device.platform != "android":
            continue

        send_notification_to_android_device(
            device=device,
            token=device.fcm_token,
            title=title,
            body=event_body,
            data=data
        )


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
        title=f"Eventos de Hoy {today_havana.day}/{today_havana.month}/{today_havana.year}",
        data={
            "pathname": "/(tabs)/calendar",
            "params": json.dumps({
                "selectedDayParam": {
                    "year": today_havana.year,
                    "month": today_havana.month,
                    "day": today_havana.day,
                    # Convert to milliseconds for frontend
                    "timestamp": int(today_havana.timestamp() * 1000),
                    "dateString": today_havana.strftime("%Y-%m-%d")
                }
            })
        },
        # Convert end-of-day Havana time back to UTC for database filtering
        datetime_lapse=end_of_day_havana.astimezone(dt_timezone.utc)
    )


# ===========================
#  NOTIFY ABOUT A SPECIFIC EVENT
# ===========================
def send_push_notification_for_event(event, title="Evento en Camino!"):
    from notification.models import DevicePushToken
    get_firebase_app()

    devices = DevicePushToken.objects.filter(
        user__member_groups__event__id=event.id
        ).distinct()

    for device in devices:

        event_start = convert_event_time_for_user(
            event.start_time, device.timezone
        )

        if device.platform != "android":
            continue

        send_notification_to_android_device(
            device=device,
            token=device.fcm_token,
            title=title,
            body=f"{get_event_date_interval_string(event, device.timezone)} | {event_start.strftime('%I:%M %p').lower()}\n{event.title}",
            data={
                "pathname": "/(tabs)/calendar",
                "params": json.dumps({
                    "selectedDayParam": {
                        "year": event_start.year,
                        "month": event_start.month,
                        "day": event_start.day,
                        "timestamp": int(event_start.timestamp() * 1000),
                        "dateString": event_start.strftime("%Y-%m-%d")
                    }
                })
            }
        )


def send_notification_to_everyone(title, body, data):
    from notification.models import DevicePushToken
    get_firebase_app()

    devices = DevicePushToken.objects.all()

    print(f"Sending notification to {devices.count()} devices ...")

    for device in devices:
        if device.platform != "android":
            continue
        send_notification_to_android_device(
            device=device,
            token=device.fcm_token,
            title=title,
            body=body,
            data=data
        )


def send_notification_to_android_device(device, token, title, body, data):
    try:
        message = messaging.Message(
            token=token,
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data,
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(
                    sound="default",
                ),
            ),
        )
        messaging.send(message)

    # except exceptions.UnregisteredError:
    #     device.delete()

    except exceptions.InvalidArgumentError as e:
        logger.warning(
            f"Invalid payload for sending notification to device: {device.device_name} of user {device.user.full_name}", e
        )

    except exceptions.FirebaseError as e:
        logger.error(f"FCM error: {e}")


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