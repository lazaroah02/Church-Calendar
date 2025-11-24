from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import gettext
import logging

logger = logging.getLogger("user")


def handle_bulk_delete(
    request, *,
    user,
    ids_field_name: str,
    model,
    log_name: str,
):
    """
    Handles bulk deletion of model instances.

    Args:
        request: The request object.
        user: The user making the request.
        ids_field_name (str): Name of the field in the request body containing the IDs to delete.
        model (Model): The Django model to operate on.
        log_name (str): Used in logs and messages ("products", "categories", etc.).

    Returns:
        Response: DRF Response.
    """
    try:
        ids_to_delete = request.data.get(ids_field_name)

        if request.user.id in ids_to_delete:
            logger.warning(f"User {user} tried to delete himself.")
            return Response({"message": gettext("You can't delete yourself while you're logged in")},
                            status=status.HTTP_400_BAD_REQUEST)
        
        if not ids_to_delete:
            logger.warning(f"User {user} tried bulk delete without '{ids_field_name}' field.")
            return Response({"message": gettext(f"missing '{ids_field_name}' in query body")},
                            status=status.HTTP_400_BAD_REQUEST)

        if not all(isinstance(id_, int) for id_ in ids_to_delete):
            logger.warning(f"User {user} sent invalid {log_name} IDs: {ids_to_delete}")
            return Response({"message": gettext(f"Invalid {log_name} IDs.")},
                            status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = model.objects.filter(id__in=ids_to_delete).delete()

        if deleted_count == 0:
            logger.info(f"User {user} attempted bulk delete but no {log_name} deleted. IDs: {ids_to_delete}")
            return Response({"message": gettext(f"No {log_name} were deleted. Check if the IDs are correct.")},
                            status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"User {user} bulk deleted {deleted_count} {log_name}. IDs: {ids_to_delete}")
        return Response([], status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception during bulk delete of {log_name} by user {user}: {e}", exc_info=True)
        return Response([], status=status.HTTP_400_BAD_REQUEST)