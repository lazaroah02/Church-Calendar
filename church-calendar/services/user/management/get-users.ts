import { MANAGE_USERS_URL } from "@/api-endpoints";

export async function getUsers({ token = "" }: { token: string }) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
  };
  try {
    const res = await fetch(`${MANAGE_USERS_URL}`, options);
    if (res.ok) {
      return res.json().then((data) => {
        return data;
      });
    } else {
      throw new Error("Error getting users");
    }
  } catch (err: Error | any) {
    throw new Error(err.message || "Error getting users");
  }
}
