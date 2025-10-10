import { EVENTS_URL } from "@/api-endpoints";

export async function checkReservation({
  token = "",
  eventId,
}: {
  token: string;
  eventId?: number | string | undefined;
}) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `${EVENTS_URL}/${eventId}/is_reserved/`,
    options
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error en la operación. Inténtalo mas tarde");
  }
  return data
}
