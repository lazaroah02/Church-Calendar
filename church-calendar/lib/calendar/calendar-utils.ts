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

export function parseLocalDate(dateString: string) {
  /*
    Description:
    Parses a date string in the format "YYYY-MM-DD" and returns a JavaScript Date object.
    Unlike new Date("YYYY-MM-DD"), this function ensures the date is interpreted as a local 
    date instead of UTC, preventing timezone shifts (e.g., showing the wrong day due to device time zone).

    Parameters:
    dateString (string): A date string in "YYYY-MM-DD" format.

    Returns:
    A Date object representing the given date in the local timezone.
  */
  const [year, month, day] = dateString.split("-").map(Number);
  // OJO: month in Date starts from 0
  return new Date(year, month - 1, day);
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
  const date = parseLocalDate(dateString);

  const formatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);

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
  };

  const startFormatted = new Date(start).toLocaleTimeString("es-ES", options);
  const endFormatted = new Date(end).toLocaleTimeString("es-ES", options);

  return `${startFormatted} - ${endFormatted}`;
}

