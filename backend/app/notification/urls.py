from django.urls import path
from .views import (
    CheckForUpcommingEventsAndNotify,
    SendNotificationAboutEvent,
    UserNotificationTokenView
    )

urlpatterns = [
    path(
        'user-notification-token/',
        UserNotificationTokenView.as_view(),
        name='user-notification-token'),
    path(
        'send-notification-about-event/',
        SendNotificationAboutEvent.as_view(),
        name='send-notification-about-event'),
    path(
        'check-for-upcomming-events-and-notify/',
        CheckForUpcommingEventsAndNotify.as_view(),
        name='check-for-upcomming-events-and-notify'),
]
