from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/events/', include('events.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
]
