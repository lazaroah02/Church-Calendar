import { MANAGE_USERS_URL } from "@/api-endpoints";
import {
  defaultFiltersValues,
  UserFilters,
} from "@/components/administration/UserFilters";

export async function getUsers({
  token = "",
  search = "",
  pageParam = 1,
  pageSize = 20,
  filters = defaultFiltersValues,
}: {
  token: string;
  search?: string;
  pageParam?: number;
  pageSize?: number;
  filters?: UserFilters;
}) {
  const url = `${MANAGE_USERS_URL}?search=${search}&page=${pageParam}&page_size=${pageSize}&is_staff=${
    filters.is_staff
  }&is_active=${filters.is_active}${filters.member_groups
    .map((groupId) => `&member_groups=${groupId}`)
    .join("")}`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
    },
  };
  try {
    const res = await fetch(url, options);
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
