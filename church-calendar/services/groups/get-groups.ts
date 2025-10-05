import { CHURCH_GROUPS_URL } from "@/api-endpoints";

export async function getGroups() {
  const options: RequestInit = {
    method: "GET",
  };
  try {
    const res = await fetch(
      CHURCH_GROUPS_URL,
      options
    );
    if (res.ok) {
      return res.json().then((data) => {
        return data;
      });
    } else {
      throw new Error("Error getting groups");
    }
  } catch (err: Error | any) {
    throw new Error(err.message || "Error getting groups");
  }
}
