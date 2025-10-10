from reservation.views import ManageReservations
from rest_framework import routers

router = routers.SimpleRouter()

router.register("manage", ManageReservations, basename="manage-reservations")

urlpatterns = [
]

urlpatterns += router.urls
