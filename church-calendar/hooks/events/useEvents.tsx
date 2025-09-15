import { getEvents } from "@/services/events/get-events";
import { useState } from "react";
import { CalendarUtils } from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import type { DateString, Event, Interval } from "@/types/event";

export function useEvents() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [interval, setInterval] = useState<Interval>({
    start_date: CalendarUtils.getCalendarDateString(firstDayOfMonth),
    end_date: CalendarUtils.getCalendarDateString(lastDayOfMonth),
  });

  const {
    data,
    error: errorEvents,
    isLoading: loadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["events", JSON.stringify(interval)],
    queryFn: () =>
      getEvents({
        start_date: interval.start_date,
        end_date: interval.end_date,
      }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const events: { [date: string]: Event[] } = data || {};
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  function getSpecificDayEvents({date, dispatchStateUpdate = false}:{date: DateString, dispatchStateUpdate?: boolean}): Event[] | undefined {
    if (!date) return;
    const eventsCopy = JSON.parse(JSON.stringify(events))
    if (dispatchStateUpdate) {
      setSelectedDayEvents(eventsCopy[date] || []);
    }
    return eventsCopy[date];
  }

  return {
    events,
    refetchEvents,
    loadingEvents,
    errorEvents,
    setInterval,
    selectedDayEvents,
    getSpecificDayEvents,
  };
}
