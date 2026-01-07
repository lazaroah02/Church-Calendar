import { Interval } from "@/types/event";

const TIMEZONE = undefined;

export function getMonthIntervalFromDate(date: Date): Interval {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));

  return {
    start_date: firstDay.toISOString().slice(0, 10),
    end_date: lastDay.toISOString().slice(0, 10),
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
    timeZone: TIMEZONE,
  });

  // Force local parsing to avoid shifting back a day
  const parts = formatter.formatToParts(new Date(dateString + "T00:00:00"));

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  const formatted = `${
    weekday.charAt(0).toUpperCase() + weekday.slice(1)
  } ${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;

  return formatted;
}

export function formatTimeRange(start: string, end: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE,
  };

  const startFormatted = new Date(start).toLocaleTimeString("es-ES", options);
  const endFormatted = new Date(end).toLocaleTimeString("es-ES", options);

  return `${startFormatted} - ${endFormatted}`;
}

export function formatTimeStamp(timestamp: string): string {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE,
  });

  // Ex: "9 de septiembre de 2025, 10:05"
  const formatted = formatter.format(new Date(timestamp));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}


