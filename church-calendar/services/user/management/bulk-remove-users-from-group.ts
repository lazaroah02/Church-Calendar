import { MANAGE_GROUPS_URL } from "@/api-endpoints";

export function bulkRemoveUsersFromGroup({
  token = "",
  groupId,
  userIds,
}: {
  token: string;
  groupId: number | string,
  userIds: number[];
}) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify({ users_to_remove: userIds }),
  };

  return fetch(`${MANAGE_GROUPS_URL}${groupId}/bulk_remove_users_from_group/`, options).then((res) => {
    return res.json().then((data) => {
      if (res.ok) {
        return;
      } else {
        throw new Error(data.message)
      }
    });
  });
}
