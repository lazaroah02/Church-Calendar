import logging
from firebase_admin import messaging

logger = logging.getLogger("notification")


def send_notification_to_android_device(device, token, title, body, data):
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
    Envía notificaciones a cualquier cantidad de dispositivos,
    segmentando automáticamente en bloques de 500.
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
    Lógica interna para procesar un máximo de 500 mensajes.
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
                    if isinstance(resp.exception, (messaging.UnregisteredError, messaging.InvalidArgumentError)):
                        devices_to_delete.append(device)

            for d in devices_to_delete:
                d.delete()

    except Exception as e:
        logger.error(f"Error procesando bloque de notificaciones: {e}")