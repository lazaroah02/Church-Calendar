from django.urls import path
from .views import (
    CheckForUpcommingEventsAndNotify,
    NotifyEveryone,
    SendNotificationAboutEvent,
    UserDevicesNotificationView
    )

urlpatterns = [
    path(
        'user-devices-notification-info/',
        UserDevicesNotificationView.as_view(),
        name='user-devices-notification-info'),
    path(
        'send-notification-about-event/',
        SendNotificationAboutEvent.as_view(),
        name='send-notification-about-event'),
    path(
        'check-for-upcomming-events-and-notify/',
        CheckForUpcommingEventsAndNotify.as_view(),
        name='check-for-upcomming-events-and-notify'),
    path(
        'notify-everyone/',
        NotifyEveryone.as_view(),
        name='notify-everyone'),
]
