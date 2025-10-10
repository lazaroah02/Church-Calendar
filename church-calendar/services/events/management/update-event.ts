import { BASE_URL, MANAGE_EVENTS_URL } from "@/api-endpoints";
import { EventFormType } from "@/types/event";

export function updateEvent({
  token = "",
  data,
  eventId
}: {
  token: string;
  data: EventFormType;
  eventId?: number | string
}) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("start_time", data.start_time.toISOString());
  formData.append("end_time", data.end_time.toISOString());
  formData.append("location", data.location);
  formData.append("description", data.description);
  formData.append("is_canceled", data.is_canceled.toString());
  formData.append("open_to_reservations", data.open_to_reservations.toString());
  formData.append("visible", data.visible.toString());
  formData.append('reservations_limit', data.reservations_limit?.toString() || "")

  data.groups.forEach((id) => {
    formData.append("groups", id.toString());
  });

  if (data.img && !data.img.startsWith(BASE_URL)) {
    const filename = data.img.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("img", {
      uri: data.img,
      name: filename,
      type,
    } as any);
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
    body: formData,
  };

  return fetch(`${MANAGE_EVENTS_URL}${eventId}/`, options).then((res) => {
    return res.json().then((data) => {
      if (res.ok) {
        return data;
      } else {
        const errors: Record<string, string> = {};

        if (data.title) {
          errors.title = "Título Incorrecto. No puede estar vacío.";
        }

        if (data.location) {
          errors.location = "Lugar Incorrecto. No puede estar vacío.";
        }

        if(data.reservations_limit){
          errors.reservations_limit = "Número máximo de reservaciones inválido.";
        }

        if (data.non_field_errors) {
          if (
            data.non_field_errors[0] === "End time must be after start time."
          ) {
            errors.end_time =
              "Revisa el inicio y fin del evento. El fin debe ser después del inicio.";
          }
        }

        throw new Error(JSON.stringify(errors));
      }
    });
  });
}
