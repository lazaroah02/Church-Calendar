from event.paginators import EventsPagination
from rest_framework import viewsets, response, status
from event.models import Event
from event.serializers import (
    EventsSerializer, ManageEventsSerializer,
    )
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from event.mixins import EventListMixin
from rest_framework.decorators import action
from django.utils.translation import gettext as _

from church_group.models import ChurchGroup, GENERAL_GROUP_NAME


class Events(EventListMixin, viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for retrieving church events.

    ## Overview
    This view allows clients to fetch events either as a flat paginated list
    or grouped by specific strategies (currently only "month_days").
    It supports filtering by date ranges and group membership.

    ## Query Parameters
    - **group_by** (string, optional):
        Defines the grouping strategy for returned events.
        Currently supported: `"month_days"`.
        - If provided, `start_date` and `end_date` are required.
        - If not provided, the API returns a flat **paginated** list of events.

    - **start_date** (date, required if `group_by` is set):
        Start of the date range for events.  
        Example: `2025-09-01`.

    - **end_date** (date, required if `group_by` is set):
        End of the date range for events.  
        Must be greater than `start_date` and no more than 31 days apart.  
        Example: `2025-09-30`.

    ## Authentication Behavior
    - **Anonymous users**:
        Only see events that belong to the **General** group
        (`GENERAL_GROUP_NAME`) and are marked as visible.

    - **Authenticated users**:
        See events that are visible and belong to **any group**
        in which the user is a member.

    ## Response Format
    - **Flat list with pagination (default)**:
        A paginated list of serialized events.

        ```json
        {
          "count": 25,
          "next": "http://api.example.com/manage-events/?page=2",
          "previous": null,
          "results": [
            {
              "id": 1,
              "title": "Men's Meeting",
              "start_time": "2025-09-09T08:00:00Z",
              "end_time": "2025-09-09T10:00:00Z",
              "groups": ["General"]
            },
            {
              "id": 2,
              "title": "Sunday School",
              "start_time": "2025-09-09T10:00:00Z",
              "end_time": "2025-09-09T10:40:00Z",
              "groups": ["General", "Youth"]
            }
          ]
        }
        ```

    - **Grouped by month days (`group_by=month_days`)**:
        A dictionary with ISO dates as keys and lists of events as values.
        (This response is **not paginated**).

        ```json
        {
          "2025-09-09": [
            {
              "id": 1,
              "title": "Men's Meeting",
              "start_time": "2025-09-09T08:00:00Z",
              "end_time": "2025-09-09T10:00:00Z",
              "groups": ["General"]
            }
          ],
          "2025-09-10": [
            {
              "id": 2,
              "title": "Main Service",
              "start_time": "2025-09-10T10:40:00Z",
              "end_time": "2025-09-10T13:00:00Z",
              "groups": ["General"]
            }
          ]
        }
        ```

    ## Extensibility
    The view is designed to support multiple grouping strategies.
    To add a new grouping, implement a private method
    (e.g. `_group_by_weeks`) and map it in the `group_by` logic.

    ## Status Codes
    - **200 OK**: Request successful, events returned.
    - **400 Bad Request**: Validation error (e.g., invalid date range).
    """

    serializer_class = EventsSerializer
    pagination_class = EventsPagination

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            general_group = ChurchGroup.objects.get(name=GENERAL_GROUP_NAME)
            return Event.objects.filter(visible=True, groups__in=[general_group])
        return Event.objects.filter(
            visible=True,
            groups__in=self.request.user.member_groups.all()
        ).distinct()

    def list(self, request, *args, **kwargs):
        return self.filter_and_respond(request, self.get_queryset())

    @action(methods=["GET"], detail=True)
    def is_reserved(self, request, pk):
        try:
            if request.user.is_anonymous:
                return response.Response(
                    {"message": _("Authentication required to make reservations.")},
                    status=status.HTTP_403_FORBIDDEN
                )

            event = Event.objects.get(id=pk)

            if event.reservations.filter(user=request.user).exists():
                return response.Response(
                    {"message": _("You have reserved for this event.")},
                    status=status.HTTP_200_BAD_REQUEST
                )

            return response.Response(
                {"message": _("You don't have reservations for this event.")},
                status=status.HTTP_404_NOT_FOUND
            )

        except Event.DoesNotExist:
            return response.Response(
                {"message": _("Event requested doesn't exist.")},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(methods=["POST"], detail=True)
    def make_reservation(self, request, pk):
        try:
            if request.user.is_anonymous:
                return response.Response(
                    {"message": _("Authentication required to make reservations.")},
                    status=status.HTTP_403_FORBIDDEN
                )

            event = Event.objects.get(id=pk)

            if not event.open_to_reservations:
                return response.Response(
                    {"message": _("This event is not open to reservations.")},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if event.reservations_limit is not None and event.reservations.count() >= event.reservations_limit:
                return response.Response(
                    {"message": _("This event has reached its reservation limit.")},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if event.reservations.filter(user=request.user).exists():
                return response.Response(
                    {"message": _("You have already made a reservation for this event.")},
                    status=status.HTTP_400_BAD_REQUEST
                )

            event.reservations.create(user=request.user)

            return response.Response(
                {"message": _("Reservation created successfully.")},
                status=status.HTTP_201_CREATED
            )

        except Event.DoesNotExist:
            return response.Response(
                {"message": _("Event requested doesn't exist.")},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(methods=["DELETE"], detail=True)
    def remove_reservation(self, request, pk):
        try:
            if request.user.is_anonymous:
                return response.Response(
                    {"message": _("Authentication required to make reservations.")},
                    status=status.HTTP_403_FORBIDDEN
                )

            event = Event.objects.get(id=pk)
            event.reservations.filter(user=request.user).delete()

            return response.Response(
                {"message": _("Reservation deleted successfully.")},
                status=status.HTTP_200_OK
            )

        except Event.DoesNotExist:
            return response.Response(
                {"message": _("Event requested doesn't exist.")},
                status=status.HTTP_400_BAD_REQUEST
            )

class ManageEvents(EventListMixin, viewsets.ModelViewSet):
    """
    API endpoint for managing church events.

    ## Overview
    This viewset allows **admin users** to fully manage church events.
    It provides standard CRUD operations (`list`, `create`, `retrieve`,
    `update`, `partial_update`, `destroy`) and supports event retrieval
    as either a flat paginated list or grouped by specific strategies
    (currently only "month_days").

    ## Query Parameters (for listing events)
    - **group_by** (string, optional):
        Defines the grouping strategy for returned events.
        Currently supported: `"month_days"`.
        - If provided, `start_date` and `end_date` are required.
        - If not provided, the API returns a flat **paginated** list of events.

    - **start_date** (date, required if `group_by` is set):
        Start of the date range for events.  
        Example: `2025-09-01`.

    - **end_date** (date, required if `group_by` is set):
        End of the date range for events.  
        Must be greater than `start_date` and no more than 31 days apart.  
        Example: `2025-09-30`.

    - **page** (integer, optional, default=1):  
        Page number for pagination (only applies if `group_by` is not set).

    - **page_size** (integer, optional, default=10):  
        Number of events per page. Maximum is 100.

    ## Authentication & Permissions
    - Only authenticated users with **admin privileges** can access this endpoint.
    - Permission classes: `IsAuthenticated` and `IsAdminUser`.

    ## Response Format
    - **Flat list with pagination (default)**:
        A paginated list of serialized events.

        ```json
        {
          "count": 25,
          "next": "http://api.example.com/manage-events/?page=2",
          "previous": null,
          "results": [
            {
              "id": 1,
              "title": "Men's Meeting",
              "start_time": "2025-09-09T08:00:00Z",
              "end_time": "2025-09-09T10:00:00Z",
              "groups": ["General"]
            },
            {
              "id": 2,
              "title": "Sunday School",
              "start_time": "2025-09-09T10:00:00Z",
              "end_time": "2025-09-09T10:40:00Z",
              "groups": ["General", "Youth"]
            }
          ]
        }
        ```

    - **Grouped by month days (`group_by=month_days`)**:
        A dictionary with ISO dates as keys and lists of events as values.
        (This response is **not paginated**).

        ```json
        {
          "2025-09-09": [
            {
              "id": 1,
              "title": "Men's Meeting",
              "start_time": "2025-09-09T08:00:00Z",
              "end_time": "2025-09-09T10:00:00Z",
              "groups": ["General"]
            }
          ],
          "2025-09-10": [
            {
              "id": 2,
              "title": "Main Service",
              "start_time": "2025-09-10T10:40:00Z",
              "end_time": "2025-09-10T13:00:00Z",
              "groups": ["General"]
            }
          ]
        }
        ```

    ## Extensibility
    The viewset is designed to support multiple grouping strategies.
    To add a new grouping, implement a private method
    (e.g. `_group_by_weeks`) and integrate it in the `list` method logic.

    ## Status Codes
    - **200 OK**: Request successful, events returned.
    - **201 Created**: Event successfully created.
    - **400 Bad Request**: Validation error (e.g., invalid date range).
    - **403 Forbidden**: User is not authenticated or not an admin.
    - **404 Not Found**: Requested event does not exist.
    - **204 No Content**: Event successfully deleted.
    """

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ManageEventsSerializer
    queryset = Event.objects.all()
    pagination_class = EventsPagination

    def list(self, request, *args, **kwargs):
        return self.filter_and_respond(request, self.get_queryset())
