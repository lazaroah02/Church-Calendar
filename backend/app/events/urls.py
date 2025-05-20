from django.urls import path
from events.views import Events
from rest_framework import routers

router = routers.SimpleRouter()

router.register("", Events, basename = "events")

urlpatterns = []

urlpatterns += router.urls
