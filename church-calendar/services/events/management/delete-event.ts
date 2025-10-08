import { MANAGE_EVENTS_URL } from "@/api-endpoints";

export function deleteEvent({
  token = "",
  eventId,
}: {
  token: string;
  eventId: number | string;
}) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
  };

  return fetch(`${MANAGE_EVENTS_URL}${eventId}/`, options).then((res) => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Error al eliminar el  evento.");
    }
  });
}
