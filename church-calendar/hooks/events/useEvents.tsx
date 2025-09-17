import { getEvents } from "@/services/events/get-events";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DateString, Event, Interval } from "@/types/event";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { CalendarUtils, DateData } from "react-native-calendars";
import { useSession } from "../auth/useSession";

export function useEvents() {
  /**
   * State: Current visible interval (start and end dates) based on the calendar month.
   * Default: The month of today.
   */
  const [interval, setInterval] = useState<Interval>(
    getMonthIntervalFromDate(new Date())
  );

  /**
   * Current user session (needed to authenticate API calls).
   */
  const { session } = useSession();

  /**
   * Today's date in `DateData` format (react-native-calendars).
   * Used to initialize the default selected day.
   */
  const todaysDate = new Date();
  const today = CalendarUtils.getCalendarDateString(todaysDate);

  /**
   * State: The currently selected day in the calendar.
   */
  const [selectedDay, setSelectedDay] = useState<DateData>({
    dateString: today,
    day: todaysDate.getDate(),
    month: todaysDate.getMonth() + 1,
    year: todaysDate.getFullYear(),
    timestamp: todaysDate.getTime(),
  });

  /**
   * State: Cache of the last selected day's events.
   * Used as a fallback when navigating between months.
   */
  const [selectedDayEventsCache, setSelectedDayEventsCache] = useState<Event[]>(
    []
  );

  /**
   * Query: Fetch events for the current month interval.
   * - Keyed by interval + session token.
   * - Cached for 30 minutes.
   */
  const {
    data,
    error: errorEvents,
    isLoading: loadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["events", JSON.stringify(interval), session?.token],
    queryFn: () =>
      getEvents({
        start_date: interval.start_date,
        end_date: interval.end_date,
        token: session?.token,
      }),
    staleTime: 1000 * 60 * 30,
  });

  /**
   * Dictionary of events keyed by date string.
   * Example: { "2025-09-15": [event1, event2], "2025-09-16": [event3] }
   */
  const events: { [date: string]: Event[] } = useMemo(() => data || {}, [data]);

  /**
   * Utility: Get events for a specific day.
   *
   * Rules:
   * - If the date belongs to the current month:
   *   - Return [] if no events exist for that day.
   * - If the date belongs to another month:
   *   - Return undefined → fallback to cached events.
   * - Otherwise, return the events for that date.
   */
  const getSpecificDayEvents = useCallback(
    (date: DateString): Event[] | undefined => {
      const sameMonth =
        selectedDay.month === parseInt(interval.start_date.split("-")[1]);

      if (!events.hasOwnProperty(date) && sameMonth) {
        return [];
      } else if (!events.hasOwnProperty(date) && !sameMonth) {
        return undefined;
      }
      return events[date];
    },
    [events, interval, selectedDay]
  );

  /**
   * Derive the events for the currently selected day.
   * Can be [] (no events in this month) or undefined (different month).
   */
  const currentDayEvents = useMemo(() => {
    return getSpecificDayEvents(selectedDay.dateString);
  }, [getSpecificDayEvents, selectedDay]);

  /**
   * Effect: Update the cache if the current day has a valid result.
   * This ensures that when switching months, the last valid selection persists.
   */
  useEffect(() => {
    if (currentDayEvents !== undefined) {
      setSelectedDayEventsCache(currentDayEvents);
    }
  }, [currentDayEvents]);

  /**
   * Final events for the selected day:
   * - If `currentDayEvents` is [] → show "No events".
   * - If `currentDayEvents` is undefined → use cached events (month changed).
   * - Otherwise, return the actual events.
   */
  const selectedDayEvents =
    currentDayEvents !== undefined ? currentDayEvents : selectedDayEventsCache;

  return {
    events,                // All events for the current interval
    refetchEvents,         // Refetch function for manual refresh
    loadingEvents,         // Loading state for events
    errorEvents,           // Error state for events
    setInterval,           // Update the current month interval
    selectedDay,           // Currently selected day
    setSelectedDay,        // Update selected day
    selectedDayEvents,     // Events for the currently selected day
    getSpecificDayEvents,  // Utility to get events for a given date
  };
}
