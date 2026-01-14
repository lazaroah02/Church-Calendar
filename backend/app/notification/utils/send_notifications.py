import json
import logging
import platform
from django.utils import timezone
import pytz
from notification.utils.prepare_events_data_for_notifications import (
    convert_event_time_for_user,
    build_events_notification_body_for_user,
    get_event_date_interval_string
    )
from notification.utils.processing_notifications import (
    send_notification_to_android_device,
    send_bulk_notifications_to_android_devices
    )
from notification.firebase import get_firebase_app
from event.models import Event
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.db.models import Q

User = get_user_model()
logger = logging.getLogger("notification")


# ************CURRENTLY ONLY ANDROID IS SUPPORTED************
# ************HAVANA TIMEZONE USED************

# ===========================
#  NOTIFY ABOUT UPCOMING EVENTS
# ===========================
def send_push_notification_for_upcomming_events(
        title="Eventos Próximos",
        data={},
        datetime_lapse=timezone.now() + timezone.timedelta(minutes=60)
        ):
    """
    Docstring for send_push_notification_for_upcomming_events
    
    :param title: Notification title
    :param data: Notification data payload
    :param datetime_lapse: This indicates the interval of time to check for events. Look for events that start
    between now and this datetime.
    """
    from notification.models import DevicePushToken
    get_firebase_app()
    now = timezone.now()

    upcoming_events = Event.objects.filter(
        # --- CONDICIONES GENERALES ---
        visible=True,
        is_canceled=False,
    ).filter(
        Q(
            # Caso A: Eventos que empiezan exactamente hoy dentro del rango
            start_time__gte=now,
            start_time__lte=datetime_lapse
        ) |
        Q(
            start_time__date__lte=now,
            end_time__date__gte=now,
            start_time__time__gte=now.time(),
            start_time__time__lte=datetime_lapse.time(),
        )
    )

    print(f"{upcoming_events.count()} upcoming events found.")
    print(upcoming_events.values_list("title", flat=True))

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
    """
    Identifies events occurring today in the Havana timezone and sends push notifications 
    to users belonging to the associated groups.

    The logic follows a two-step filtering process:
    1. A wide database-level query to account for UTC offsets.
    2. A manual refinement in Python to ensure events strictly overlap with Cuba's current date.
    
    It then builds a personalized notification body for each user and dispatches it via FCM.
    """
    from notification.models import DevicePushToken
    get_firebase_app()

    # 1. Define "Today" in Cuba timezone
    # We use Havana as the reference to determine which events are relevant for the current day.
    havana_tz = pytz.timezone("America/Havana")
    now_havana = timezone.now().astimezone(havana_tz)
    today_date_havana = now_havana.date()

    # 2. BROAD FILTER (Database Level)
    # We capture a 1-day margin before and after to ensure no events 
    # are missed due to UTC/Local timezone offsets.
    yesterday = today_date_havana - timedelta(days=1)
    tomorrow = today_date_havana + timedelta(days=1)

    wide_range_events = Event.objects.filter(
        visible=True,
        is_canceled=False,
        start_time__date__lte=tomorrow,  # Up to tomorrow
        end_time__date__gte=yesterday    # From yesterday
    ).distinct()

    # 3. MANUAL REFINEMENT (Python Logic)
    # Here we filter events that ACTUALLY occur today according to Havana local time.
    upcoming_events_ids = []
    
    for event in wide_range_events:
        # Convert event boundaries to Cuba local time
        event_start_local = event.start_time.astimezone(havana_tz).date()
        event_end_local = event.end_time.astimezone(havana_tz).date()

        # Check if the current date in Cuba falls within the local start and end range
        if event_start_local <= today_date_havana <= event_end_local:
            upcoming_events_ids.append(event.id)

    # Re-fetch the final queryset based on validated IDs
    upcoming_events = wide_range_events.filter(id__in=upcoming_events_ids)

    print(f"Wide range captured {wide_range_events.count()}, Havana refinement captured {upcoming_events.count()}")

    # 4. RETRIEVE TARGET DEVICES
    # Get devices belonging to users who are members of groups associated with today's events.
    devices = (
        DevicePushToken.objects
        .filter(user__member_groups__event__id__in=upcoming_events.values_list("id", flat=True))
        .distinct()
    )

    for device in devices:
        # Important: Filter specific events for this user from today's filtered list
        user_events = upcoming_events.filter(
            groups__in=device.user.member_groups.all()
        ).distinct()

        if not user_events.exists():
            continue

        # Build the notification content based on the user's specific events
        event_body = build_events_notification_body_for_user(
            user_events, device.timezone
        )

        if device.platform == "android":
            send_notification_to_android_device(
                device=device,
                token=device.fcm_token,
                title=f"Eventos de Hoy {today_date_havana.strftime('%d/%m/%Y')}",
                body=event_body,
                data={
                    "pathname": "/(tabs)/calendar",
                    "params": json.dumps({
                        "selectedDayParam": {
                            "year": today_date_havana.year,
                            "month": today_date_havana.month,
                            "day": today_date_havana.day,
                            "timestamp": int(now_havana.timestamp() * 1000),
                            "dateString": today_date_havana.strftime("%Y-%m-%d")
                        }
                    })
                }
            )


# ===========================
#  NOTIFY ABOUT A SPECIFIC EVENT
# ===========================
def send_push_notification_for_event(event, title="Evento en Camino!"):
    from notification.models import DevicePushToken
    get_firebase_app()

    havana_timezone = "America/Havana"

    devices = DevicePushToken.objects.filter(
        user__member_groups__event__id=event.id
        ).distinct()
    android_devices = devices.filter(platform="android")

    event_start = convert_event_time_for_user(
            event.start_time, havana_timezone
        )

    send_bulk_notifications_to_android_devices(
        devices=android_devices,
        title=title,
        body=f"{get_event_date_interval_string(event, havana_timezone)} | {event_start.strftime('%I:%M %p').lower()}\n{event.title}",
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


# ===========================
#  NOTIFY TO EVERYONE
# ===========================
def send_notification_to_everyone(title, body, data):
    from notification.models import DevicePushToken
    get_firebase_app()

    devices = DevicePushToken.objects.all()
    android_devices = devices.filter(platform="android")

    print(f"Sending notification to {devices.count()} devices ...")
    send_bulk_notifications_to_android_devices(
        devices=android_devices, title=title, body=body, data=data
        )
