import { getEvents } from "@/services/events/get-events";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DateString, Event, Interval } from "@/types/event";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { CalendarUtils, DateData } from "react-native-calendars";

export function useEvents() {
  const [interval, setInterval] = useState<Interval>(
    getMonthIntervalFromDate(new Date())
  );

  const todaysDate = new Date();
  const today = CalendarUtils.getCalendarDateString(todaysDate);
  const [selectedDay, setSelectedDay] = useState<DateData>({
    dateString: today,
    day: todaysDate.getDate(),
    month: todaysDate.getMonth() + 1,
    year: todaysDate.getFullYear(),
    timestamp: todaysDate.getTime(),
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

  const events: { [date: string]: Event[] } = useMemo(() => data || {}, [data]);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  const getSpecificDayEvents = useCallback(
    (date: DateString): Event[] => {
      return events[date] || [];
    },
    [events]
  );

  useEffect(() => {
    setSelectedDayEvents(getSpecificDayEvents(selectedDay.dateString));
  }, [events, selectedDay, getSpecificDayEvents]);

  return {
    events,
    refetchEvents,
    loadingEvents,
    errorEvents,
    setInterval,
    selectedDayEvents,
    getSpecificDayEvents,
    selectedDay,
    setSelectedDay,
  };
}
