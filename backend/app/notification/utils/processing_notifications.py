import logging
from firebase_admin import messaging

logger = logging.getLogger("notification")


def send_notification_to_android_device(device, token, title, body, data):
    """
    Sends a single FCM notification to a specific Android device.

    Args:
        device (object): The device model instance. Must have a .delete() method 
            and a .device_name attribute.
        token (str): The FCM registration token for the target device.
        title (str): The title of the notification.
        body (str): The message content of the notification.
        data (dict): Extra key-value pairs to include in the data payload.

    Raises:
        messaging.FirebaseError: Logged if an unhandled Firebase error occurs.
    """
    try:
        message = messaging.Message(
            token=token,
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data={
                **data,
                "title": title,
                "body": body,
            },
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(
                    sound="default",
                ),
            ),
        )
        messaging.send(message)

    except messaging.UnregisteredError:
        logger.info(
            f"FCM token unregistered. Deleting device {device.device_name}"
        )
        device.delete()

    except messaging.InvalidArgumentError:
        logger.warning(
            f"Invalid FCM token for device {device.device_name}. Deleting device."
        )
        device.delete()

    except (
        messaging.QuotaExceededError,
        messaging.InternalError,
        messaging.UnavailableError,
        messaging.ThirdPartyAuthError,
    ) as e:
        logger.error(f"Transient FCM error: {e}")

    except messaging.FirebaseError as e:
        logger.error(f"Unhandled FCM error: {e}")


def send_bulk_notifications_to_android_devices(devices, title, body, data):
    """
    Sends notifications to a large number of devices by batching them.

    This function prevents hitting FCM rate limits by automatically 
    splitting the device list into chunks of 500 (the maximum allowed 
    by Firebase per request).

    Args:
        devices (iterable): A list or QuerySet of device objects. 
            Each object must have an .fcm_token attribute.
        title (str): The title for the notifications.
        body (str): The message body for the notifications.
        data (dict): The data payload shared across all notifications.
    """
    MAX_BATCH_SIZE = 500

    device_list = list(devices)
    total_devices = len(device_list)

    if total_devices == 0:
        return

    for i in range(0, total_devices, MAX_BATCH_SIZE):
        chunk = device_list[i: i + MAX_BATCH_SIZE]
        _process_chunk(chunk, title, body, data)


def _process_chunk(chunk, title, body, data):
    """
    Internal helper to process a single batch of up to 500 messages.

    Uses messaging.send_each() for optimized delivery and handles 
    bulk cleanup of invalid or expired device tokens.

    Args:
        chunk (list): A slice of device objects.
        title (str): Notification title.
        body (str): Notification body.
        data (dict): Data payload.
    """
    messages = [
        messaging.Message(
            token=d.fcm_token,
            notification=messaging.Notification(title=title, body=body),
            data={**data, "title": title, "body": body},
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(sound="default"),
            ),
        ) for d in chunk
    ]

    try:
        response = messaging.send_each(messages)

        if response.failure_count > 0:
            devices_to_delete = []
            for idx, resp in enumerate(response.responses):
                if not resp.success:
                    device = chunk[idx]
                    # Identify tokens that are no longer valid
                    if isinstance(resp.exception, (messaging.UnregisteredError, messaging.InvalidArgumentError)):
                        devices_to_delete.append(device)

            # Cleanup invalid devices from the database
            for d in devices_to_delete:
                d.delete()

    except Exception as e:
        logger.error(f"Error processing notification batch: {e}")