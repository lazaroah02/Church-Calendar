from rest_framework import response, status
from event.serializers import EventParamsSerializer, GroupByChoices
from event.utils.group_events import group_by_month_days
import pytz


class EventListMixin:
    """
    Shared logic for listing events, supporting grouping and pagination.
    """

    def filter_and_respond(self, request, base_queryset):
        # Validar parámetros incluyendo timezone
        serializer = EventParamsSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        group_by = serializer.validated_data.get("group_by")
        start_date = serializer.validated_data.get("start_date")
        end_date = serializer.validated_data.get("end_date")
        tz_name = serializer.validated_data.get("timezone", "UTC")

        # Obtener timezone seguro
        try:
            tz = pytz.timezone(tz_name)
        except Exception:
            tz = pytz.UTC

        qs = base_queryset

        # Filtrado por fechas (UTC)
        if start_date and end_date:
            qs = qs.filter(
                start_time__date__lte=end_date,
                end_time__date__gte=start_date
            )

        # Respuesta agrupada por días del mes
        if group_by == GroupByChoices.MONTH_DAYS:
            grouped = group_by_month_days(qs, self.get_serializer_class(), tz=tz)
            return response.Response(grouped, status=status.HTTP_200_OK)

        # Respuesta plana con paginación
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
