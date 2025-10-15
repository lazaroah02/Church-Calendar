import { MANAGE_USERS_URL } from "@/api-endpoints";

export function deleteUser({
  token = "",
  userId,
}: {
  token: string;
  userId: number | string;
}) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
  };

  return fetch(`${MANAGE_USERS_URL}${userId}/`, options).then((res) => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Error al eliminar el usuario.");
    }
  });
}
