import { NOTIFY_ABOUT_EVENT_URL } from "@/api-endpoints";

export async function notifyAboutEvent({
  event_id,
  token,
}: {
  event_id: string;
  token: string;
}) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
    },
    body: JSON.stringify({
      event_id: event_id,
    }),
  };
  try {
    const res = await fetch(`${NOTIFY_ABOUT_EVENT_URL}`, options);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const data = await res.json();
      if(data.error){
        throw new Error(data.error);
      }
      throw new Error("Error al enviar la notificación.");
    }
  } catch (error: any) {
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      throw new Error("Error en la operación. Revisa tu conexión de internet.");
    }
    throw new Error(error.message);
  }
}
