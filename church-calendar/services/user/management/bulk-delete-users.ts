import { MANAGE_USERS_URL } from "@/api-endpoints";

export function bulkDeleteUsers({
  token = "",
  userIds,
}: {
  token: string;
  userIds: number[];
}) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ users_to_delete: userIds }),
  };

  return fetch(`${MANAGE_USERS_URL}bulk_delete_users/`, options).then((res) => {
    return res.json().then((data) => {
      if (res.ok) {
        return;
      } else {
        if(data.message.includes("Missing")){
          throw new Error('Debes seleccionar al menos un usuario.');
        }
        if(data.message.includes("You can't delete yourself")){
          throw new Error('No puedes eliminar tu propio usuario.');
        }
        throw new Error('Error al eliminar los usuarios.');
      }
    });
  });
}
