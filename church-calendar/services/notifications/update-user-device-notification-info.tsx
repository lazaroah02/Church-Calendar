import { USER_NOTIFICATION_TOKEN_URL } from "@/api-endpoints";
import { DevicePushNotificationInfo } from "@/types/notification";

export async function updateUserDeviceNotificationInfo({
  data,
  token,
}: {
  token: string;
  data: DevicePushNotificationInfo;
}) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
    },
    body: JSON.stringify(data),
  };
  try {
    const res = await fetch(`${USER_NOTIFICATION_TOKEN_URL}`, options);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const data = await res.json();
      if(data.message){
        throw new Error(data.message);
      }
      if(data.detail){
        throw new Error(data.detail);
      }
      if(data.error){
        throw new Error(data.error);
      }
      throw new Error("Error updating notification info");
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
