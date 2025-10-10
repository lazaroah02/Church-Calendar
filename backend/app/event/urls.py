from event.views import Events, ManageEvents
from rest_framework import routers

router = routers.SimpleRouter()

router.register("manage", ManageEvents, basename="manage-events")
router.register("", Events, basename="events")

urlpatterns = [
]

urlpatterns += router.urls
