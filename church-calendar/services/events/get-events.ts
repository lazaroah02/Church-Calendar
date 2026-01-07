import { EVENTS_URL } from "@/api-endpoints";
import { GetEventsProps } from "@/types/event";

export async function getEvents({
  start_date,
  end_date,
  group_by = "month_days",
  token = "",
}: GetEventsProps) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit"
    },
  };
  try {
    const res = await fetch(
      `${EVENTS_URL}?start_date=${start_date}&end_date=${end_date}&group_by=${group_by}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      options
    );
    if (res.ok) {
      return res.json().then((data) => {
        return data;
      });
    } else {
      throw new Error("Error getting events");
    }
  } catch (err: Error | any) {
    throw new Error(err.message ?? "Error getting events");
  }
}
