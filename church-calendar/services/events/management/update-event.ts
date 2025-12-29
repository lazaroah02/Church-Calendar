import { MANAGE_EVENTS_URL } from "@/api-endpoints";
import { EventFormType } from "@/types/event";
import { buildFormData, buildJsonPayload, handleNetworkError, handleResponse } from "./create-event";

/**
 * Updates an existing event.
 *
 * Behavior:
 * - If the image already exists in the backend (`/media/...`) or no image is provided,
 *   the request is sent as JSON.
 * - If the image is a new local file, the request is sent as multipart/form-data.
 *
 * @param token - Authentication token
 * @param data - Event form data
 * @param eventId - Event ID to update
 */
export function updateEvent({
  token = "",
  data,
  eventId,
}: {
  token: string;
  data: EventFormType;
  eventId?: number | string;
}) {
  if (!eventId) {
    throw new Error("Event ID is required to update an event.");
  }

  const isExistingImage =
    typeof data.img === "string" && data.img.startsWith("/media/");

  /**
   * ============================
   * CASE 1: Existing image or no image
   * → Send JSON payload
   * ============================
   */
  if (isExistingImage || !data.img) {
    const payload = buildJsonPayload(data);

    return fetch(`${MANAGE_EVENTS_URL}${eventId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "es",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(handleNetworkError);
  }

  /**
   * ============================
   * CASE 2: New image selected locally
   * → Send multipart/form-data
   * ============================
   */
  const formData = buildFormData(data);

  return fetch(`${MANAGE_EVENTS_URL}${eventId}/`, {
    method: "PUT",
    headers: {
      "Accept-Language": "es",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: formData,
  })
    .then(handleResponse)
    .catch(handleNetworkError);
}
