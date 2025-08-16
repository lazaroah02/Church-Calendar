from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/events/', include('event.urls')),
    path('api/church-groups/', include('church_group.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/users/', include('user.urls')),
]
