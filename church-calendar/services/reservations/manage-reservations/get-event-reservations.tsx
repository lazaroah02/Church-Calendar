import { MANAGE_RESERVATIONS_URL } from "@/api-endpoints";

export async function getEventReservations({
  token = "",
  eventId,
  pageParam = 1,
  pageSize = 20,
}: {
  token: string;
  eventId?: number | string | undefined;
  pageParam?: number
  pageSize?:number
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
  try {
    const res = await fetch(
      `${MANAGE_RESERVATIONS_URL}?event=${eventId}&page=${pageParam}&page_size=${pageSize}`,
      options
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || "Error en la operación. Inténtalo mas tarde"
      );
    }
    return data;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      throw new Error("Error en la operación. Revisa tu conexión de internet.");
    }
    throw new Error("Error al conectar con el servidor. Inténtalo mas tarde.");
  }
}
