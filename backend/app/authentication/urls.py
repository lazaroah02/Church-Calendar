from django.urls import path, include
from authentication.views import CustomLoginView
from dj_rest_auth.views import (
    LogoutView,
    PasswordChangeView,
    PasswordResetView,
    PasswordResetConfirmView,
    UserDetailsView,
)

urlpatterns = [
    path('register/', include('dj_rest_auth.registration.urls')),
    path("login/", CustomLoginView.as_view(), name="custom_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("user/", UserDetailsView.as_view(), name="rest_user_details"),
    path(
        "password/change/",
        PasswordChangeView.as_view(),
        name="rest_password_change"
        ),
    path(
        "password/reset/",
        PasswordResetView.as_view(),
        name="rest_password_reset"),
    path(
        "password/reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="rest_password_reset_confirm")
]
