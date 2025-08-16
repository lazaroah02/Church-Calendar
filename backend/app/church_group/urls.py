from church_group.views import ChurchGroups, ChurchGroupsManagement
from rest_framework import routers

router = routers.SimpleRouter()

router.register("manage", ChurchGroupsManagement, basename="church-groups-management")
router.register("", ChurchGroups, basename="church-groups")

urlpatterns = []

urlpatterns += router.urls
