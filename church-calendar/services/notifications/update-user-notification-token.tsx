import { USER_NOTIFICATION_TOKEN_URL } from "@/api-endpoints";

export async function updateUserNotificationToken({
  new_fcm_token,
  token,
}: {
  new_fcm_token: string;
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
      fcm_token: new_fcm_token,
    }),
  };
  try {
    const res = await fetch(`${USER_NOTIFICATION_TOKEN_URL}`, options);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Error updating notification token");
    }
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
