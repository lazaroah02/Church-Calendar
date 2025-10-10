import { EVENTS_URL } from "@/api-endpoints";

export async function removeReservation({
  token = "",
  eventId,
}: {
  token: string;
  eventId?: number | string | undefined;
}) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `${EVENTS_URL}/${eventId}/remove_reservation/`,
    options
  );
  const data = await res.json();
  if (!res.ok) {
    if(res.status === 429){
      throw new Error("Has alcanzado el límite de acciones. Inténtalo mas tarde.");
    }
    throw new Error(data.message || "Error en la operación. Inténtalo mas tarde");
  }
  return data
}
