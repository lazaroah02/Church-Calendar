import { EVENTS_URL } from "@/api-endpoints";

export async function makeReservation({
  token = "",
  eventId,
}: {
  token: string;
  eventId?: number | string | undefined;
}) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `${EVENTS_URL}/${eventId}/make_reservation/`,
    options
  );
  const data = await res.json();
  if (!res.ok) {
    if(res.status === 429){
      throw new Error("Has alcanzado el límite de acciones. Inténtalo mas tarde.");
    }
    throw new Error(data.message || "Error al hacer la reserva");
  }
  return data
}
