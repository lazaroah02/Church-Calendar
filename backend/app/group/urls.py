from group.views import Groups, GroupsManagement
from rest_framework import routers

router = routers.SimpleRouter()

router.register("manage", GroupsManagement, basename="groups-management")
router.register("", Groups, basename="groups")

urlpatterns = []

urlpatterns += router.urls
