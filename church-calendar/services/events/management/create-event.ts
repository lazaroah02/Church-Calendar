import { BASE_URL, MANAGE_EVENTS_URL } from "@/api-endpoints";
import { CreateEvent } from "@/types/event";

export function createEvent({
  token = "",
  data,
}: {
  token: string;
  data: CreateEvent;
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
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
    body: formData,
  };

  return fetch(MANAGE_EVENTS_URL, options).then((res) => {
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
