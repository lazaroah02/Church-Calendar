from django.urls import path
from .views import UserNotificationTokenView

urlpatterns = [
    path(
        'user-notification-token/',
        UserNotificationTokenView.as_view(),
        name='user-notification-token'),
]