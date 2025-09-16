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

export function formatSelectedDay(dateString: string): string {
  /*
    Description:
    Formats a date string ("YYYY-MM-DD") into a human-readable string in Spanish. 
    It uses Intl.DateTimeFormat (toLocaleDateString) to localize the weekday, day, month, and year, 
    and then applies additional string transformations to:

    - Capitalize the first character.
    - Replace the last "de" before the year with a comma to match the style: "Martes 9 de Septiembre, 2025".

    Parameters:
    dateString (string): A date string in "YYYY-MM-DD" format.

    Returns:
    A formatted string representing the date in Spanish, styled consistently for UI display.
  */
  const formatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });

  const parts = formatter.formatToParts(new Date(dateString));

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  let formatted = `${
    weekday.charAt(0).toUpperCase() + weekday.slice(1)
  } ${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;

  return formatted;
}

export function formatTimeRange(start: string, end: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };

  const startFormatted = new Date(start).toLocaleTimeString("es-ES", options);
  const endFormatted = new Date(end).toLocaleTimeString("es-ES", options);

  return `${startFormatted} - ${endFormatted}`;
}

