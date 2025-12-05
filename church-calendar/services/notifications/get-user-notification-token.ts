import { USER_NOTIFICATION_TOKEN_URL } from "@/api-endpoints";

export async function getUserNotificationToken({
  token = "",
}: {
  token?: string;
}): Promise<{ fcm_token: string }> {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
  };
  try {
    const res = await fetch(
      `${USER_NOTIFICATION_TOKEN_URL}`,
      options
    );
    if (res.ok) {
      return res.json().then((data) => {
        return data;
      });
    } else {
      throw new Error("Error getting user notification token");
    }
  } catch (err: Error | any) {
    throw new Error(err.message || "Error getting user notification token. Check your network and try again.");
  }
}
