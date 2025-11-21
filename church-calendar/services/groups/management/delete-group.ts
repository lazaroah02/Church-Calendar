import { MANAGE_GROUPS_URL } from "@/api-endpoints";

export function deleteGroup({
  token = "",
  groupId,
}: {
  token: string;
  groupId: number | string;
}) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
  };

  return fetch(`${MANAGE_GROUPS_URL}${groupId}/`, options).then((res) => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Error al eliminar el grupo.");
    }
  });
}
