from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/events/', include('event.urls')),
    path('api/reservations/', include('reservation.urls')),
    path('api/church-groups/', include('church_group.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/users/', include('user.urls')),
    path('api/notification/', include('notification.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
