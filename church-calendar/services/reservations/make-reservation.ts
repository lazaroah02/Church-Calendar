import { EVENTS_URL } from "@/api-endpoints";

export async function makeReservation({
  token = "",
  eventId,
}: {
  token: string;
  eventId?: number | string;
}) {
  try {
    const res = await fetch(`${EVENTS_URL}/${eventId}/make_reservation/`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
        "Accept-Language": "es",
        "Content-Type": "application/json",
      },
      credentials: "omit",
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    // Manejo de errores HTTP
    if (!res.ok) {
      switch (res.status) {
        case 429:
          throw new Error("Has alcanzado el límite de acciones. Inténtalo más tarde.");
        case 500:
        default:
          throw new Error(data?.message || "Error en el operación. Inténtalo más tarde.");
      }
    }

    return data;

  } catch (error: any) {
    if (error.name === "TypeError") {
      throw new Error("No se pudo conectar con el servidor. Revisa tu conexión a Internet.");
    }
    throw new Error(error.message || "Error desconocido al hacer la reserva. Inténtalo más tarde.");
  }
}
