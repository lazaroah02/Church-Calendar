import { MANAGE_EVENTS_URL } from "@/api-endpoints";
import { EventFormType } from "@/types/event";

/**
 * Creates a new event.
 *
 * Behavior:
 * - If the image already exists in the backend (`/media/...`), the request
 *   is sent as JSON.
 * - If the image is a new local file, the request is sent as multipart/form-data.
 *
 * @param token - Authentication token
 * @param data - Event form data
 */
export function createEvent({
  token = "",
  data,
}: {
  token: string;
  data: EventFormType;
}) {
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

    return fetch(MANAGE_EVENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  return fetch(MANAGE_EVENTS_URL, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: formData,
  })
    .then(handleResponse)
    .catch(handleNetworkError);
}

/**
 * Builds the JSON payload used when the image already exists in the backend.
 */
export function buildJsonPayload(data: EventFormType) {
  return {
    title: data.title,
    start_time: data.start_time.toISOString(),
    end_time: data.end_time.toISOString(),
    location: data.location,
    description: data.description,
    is_canceled: data.is_canceled,
    open_to_reservations: data.open_to_reservations,
    visible: data.visible,
    reservations_limit: data.reservations_limit,
    groups: data.groups,
    img: data.img, // string path: "/media/..."
  };
}

/**
 * Builds FormData used when uploading a new image file.
 */
export function buildFormData(data: EventFormType) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("start_time", data.start_time.toISOString());
  formData.append("end_time", data.end_time.toISOString());
  formData.append("location", data.location);
  formData.append("description", data.description);
  formData.append("is_canceled", data.is_canceled.toString());
  formData.append("open_to_reservations", data.open_to_reservations.toString());
  formData.append("visible", data.visible.toString());
  formData.append(
    "reservations_limit",
    data.reservations_limit?.toString() ?? ""
  );

  data.groups.forEach((id) => {
    formData.append("groups", id.toString());
  });

  const filename = data?.img?.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("img", {
    uri: data.img,
    name: filename,
    type,
  } as any);

  return formData;
}

/**
 * Handles HTTP responses returned by the backend.
 * Converts backend validation errors into a normalized error object.
 */
export function handleResponse(res: Response) {
  return res.json().then((data) => {
    if (res.ok) {
      return data;
    }

    const errors: Record<string, string> = {};

    if (data.title) {
      errors.title = "El título no es válido. No puede estar vacío.";
    } else if (data.location) {
      errors.location = "La ubicación no es válida. No puede estar vacía.";
    } else if (data.reservations_limit) {
      errors.reservations_limit =
        "El límite de reservas no es válido.";
    } else if (data.non_field_errors) {
      if (
        data.non_field_errors[0] ===
        "End time must be after start time."
      ) {
        errors.end_time =
          "Verifica las fechas del evento. La hora de finalización debe ser posterior a la hora de inicio.";
      }
    } else {
      errors.general =
        "No se pudo conectar con el servidor. Inténtalo nuevamente más tarde.";
    }

    throw new Error(JSON.stringify(errors));
  });
}

/**
 * Handles network-level errors (no internet, DNS failure, server unreachable).
 */
export function handleNetworkError(error: unknown) {

  if (error instanceof TypeError) {
    throw new Error(
      JSON.stringify({
        general:
          "No se pudo crear el evento. Verifica tu conexión a internet.",
      })
    );
  }

  throw error;
}
