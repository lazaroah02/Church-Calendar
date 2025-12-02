import { MANAGE_GROUPS_URL } from "@/api-endpoints";

export function bulkAddUsersToGroup({
  token = "",
  groupId,
  userIds,
}: {
  token: string;
  groupId: number | string;
  userIds: number[];
}) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify({ users: userIds }),
  };

  return fetch(
    `${MANAGE_GROUPS_URL}${groupId}/bulk_add_users_to_group/`,
    options
  )
    .then((res) => {
      return res.json().then((data) => {
        if (res.ok) {
          return;
        } else {
          throw new Error(data.message);
        }
      });
    })
    .catch((error) => {
      if (
        error instanceof TypeError &&
        error.message === "Network request failed"
      ) {
        throw new Error(
          "Error en la operación. Revisa tu conexión de internet."
        );
      }
      throw new Error(
        "Error al conectar con el servidor. Inténtalo mas tarde."
      );
    });
}
