import { Interval } from "@/types/event";
import { CalendarUtils } from "react-native-calendars";

export function getMonthIntervalFromDate(date: Date): Interval {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    start_date: CalendarUtils.getCalendarDateString(firstDay),
    end_date: CalendarUtils.getCalendarDateString(lastDay),
  };
}