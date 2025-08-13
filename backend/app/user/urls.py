from user.views import UsersManagment
from rest_framework import routers

# Set up DRF routers for management endpoints
router = routers.SimpleRouter()
router.register(
    "manage", UsersManagment, basename="user-managment"
)

# Define standard API endpoints
urlpatterns = []

# Add router-generated URLs for management endpoints
urlpatterns += router.urls
