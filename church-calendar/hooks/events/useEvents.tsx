import { getEvents } from "@/services/events/get-events";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DateString, Event, Interval } from "@/types/event";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";

export function useEvents() {
  const [interval, setInterval] = useState<Interval>(
    getMonthIntervalFromDate(new Date())
  );

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

  function getSpecificDayEvents({
    date,
    dispatchStateUpdate = false,
  }: {
    date: DateString;
    dispatchStateUpdate?: boolean;
  }): Event[] | undefined {
    if (!date) return;
    const eventsCopy = JSON.parse(JSON.stringify(events));
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
