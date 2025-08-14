from liga.views import Ligas, LigasManagement
from rest_framework import routers

router = routers.SimpleRouter()

router.register("manage", LigasManagement, basename="ligas-management")
router.register("", Ligas, basename="ligas")

urlpatterns = []

urlpatterns += router.urls
