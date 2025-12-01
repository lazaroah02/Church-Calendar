import { getEvents } from "@/services/events/get-events";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DateString, Event, Interval } from "@/types/event";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { CalendarUtils, DateData } from "react-native-calendars";
import { useSession } from "@/hooks/auth/useSession";
import { getEventsToManage } from "@/services/events/management/get-events-to-manage";
import { DEFAULT_STALE_TIME } from "@/lib/query-client";

/**
 * Custom hook for handling calendar events with caching and refetching logic.
 * It integrates TanStack Query for data fetching, manages event data for the
 * visible month and keeps track of a selected day with its events.
 */
export function useCalendarEventsLogic() {
  /**
   * Interval for the currently visible month (start_date - end_date).
   * Defaults to the current month when initialized.
   */
  const [interval, setInterval] = useState<Interval>(
    getMonthIntervalFromDate(new Date())
  );

  /**
   * Get the current user session (used to provide authentication token).
   */
  const { session } = useSession();
  const isAdmin = session?.userInfo?.is_staff || false;

  /**
   * Today's date string (YYYY-MM-DD) in calendar format.
   */
  const todaysDate = new Date();
  const today = CalendarUtils.getCalendarDateString(todaysDate);

  /**
   * Track the selected day on the calendar.
   * Defaults to today.
   */
  const [selectedDay, setSelectedDay] = useState<DateData>({
    dateString: today,
    day: todaysDate.getDate(),
    month: todaysDate.getMonth() + 1,
    year: todaysDate.getFullYear(),
    timestamp: todaysDate.getTime(),
  });

  /**
   * Local cache of events for the selected day.
   * Useful when the selected day belongs to a month that is not currently visible.
   */
  const [selectedDayEventsCache, setSelectedDayEventsCache] = useState<Event[]>(
    []
  );

  /**
   * React Query client instance to manually update or set cache data.
   */
  const queryClient = useQueryClient();

  /**
   * Query to fetch events for the visible month.
   * - queryKey ensures unique caching per interval and token
   * - staleTime: cache is fresh for 30 minutes
   */
  const {
    data,
    error: errorEvents,
    isLoading: loadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: [
      isAdmin ? "eventsToManage" : "events",
      JSON.stringify(interval),
      session?.userInfo?.id ?? "guest",
    ],
    queryFn: () =>
      isAdmin
        ? getEventsToManage({
            start_date: interval.start_date,
            end_date: interval.end_date,
            token: session?.token,
          })
        : getEvents({
            start_date: interval.start_date,
            end_date: interval.end_date,
            token: session?.token,
          }),
    staleTime: isAdmin ? 1000 * 60 * 1 : DEFAULT_STALE_TIME,
  });

  /**
   * Memoized map of events by date (YYYY-MM-DD).
   */
  const events: { [date: string]: Event[] } = useMemo(() => data || {}, [data]);

  /**
   * Retrieve events for a specific day.
   */
  const getSpecificDayEvents = useCallback(
    (date: DateString): Event[] => events[date] || [],
    [events]
  );

  /**
   * Memoized list of events for the currently selected day.
   * - Returns [] if day belongs to the current month but has no events.
   * - Returns undefined if day belongs to a different month that is not loaded yet.
   */
  const currentDayEvents = useMemo(() => {
    const date = selectedDay.dateString;
    const sameMonth =
      selectedDay.month === parseInt(interval.start_date.split("-")[1]);

    if (!events.hasOwnProperty(date) && sameMonth) {
      return [];
    } else if (!events.hasOwnProperty(date) && !sameMonth) {
      return undefined;
    }
    return events[date];
  }, [selectedDay, events, interval.start_date]);

  /**
   * If events for the selected day are available, update the cache.
   */
  useEffect(() => {
    if (currentDayEvents !== undefined) {
      setSelectedDayEventsCache(currentDayEvents);
    }
  }, [currentDayEvents]);

  /**
   * Use events from cache if the selected day belongs to a month
   * that is not currently visible.
   */
  const selectedDayEvents =
    currentDayEvents !== undefined ? currentDayEvents : selectedDayEventsCache;

  /**
   * Refetch handler:
   * - Refreshes events for the visible month.
   * - If the selected day belongs to a different month,
   *   it fetches events for that month too and updates cache.
   */
  const onRefetch = useCallback(async () => {
    // Refresh visible month
    await refetchEvents();

    const selectedDayMonth = selectedDay.dateString.slice(0, 7); // YYYY-MM
    const currentMonth = interval.start_date.slice(0, 7);

    // If the selected day belongs to a different month
    if (selectedDayMonth !== currentMonth) {
      const selectedInterval = getMonthIntervalFromDate(
        new Date(selectedDay.dateString)
      );

      // Fetch events for the selected day’s month
      const freshEvents = isAdmin
        ? await getEventsToManage({
            start_date: selectedInterval.start_date,
            end_date: selectedInterval.end_date,
            token: session?.token,
          })
        : await getEvents({
            start_date: selectedInterval.start_date,
            end_date: selectedInterval.end_date,
            token: session?.token,
          });

      // Store month events in cache
      queryClient.setQueryData(
        ["events", JSON.stringify(selectedInterval), session?.token],
        freshEvents
      );

      // Update cache for the selected day
      const freshForSelectedDay = freshEvents[selectedDay.dateString] ?? [];
      setSelectedDayEventsCache(freshForSelectedDay);
    }
  }, [
    refetchEvents,
    selectedDay,
    interval,
    session?.token,
    queryClient,
    isAdmin,
  ]);

  return {
    events, // all events for the visible month
    refetchEvents, // manual refetch for visible month
    onRefetch, // extended refetch (visible + selectedDay month)
    loadingEvents,
    errorEvents,
    setInterval, // update visible month interval
    selectedDay, // current selected day
    setSelectedDay, // update selected day
    selectedDayEvents, // events for the selected day
    getSpecificDayEvents, // helper to get events for any given day
  };
}
