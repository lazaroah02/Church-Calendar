from django.urls import path
from liga.views import Ligas
from rest_framework import routers

router = routers.SimpleRouter()

router.register("", Ligas, basename="ligas")

urlpatterns = []

urlpatterns += router.urls
