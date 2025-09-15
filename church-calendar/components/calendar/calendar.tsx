import "@/lib/calendar/calendar-locale";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { Calendar } from "react-native-calendars";
import { CalendarComponentProps } from "@/types/calendar";

export function CalendarComponent({
  setInterval,
  renderDayComponent,
}: CalendarComponentProps) {
  return (
    <Calendar
      firstDay={1}
      onMonthChange={(month) => {
        setInterval(getMonthIntervalFromDate(new Date(month.dateString)));
      }}
      dayComponent={(date) => renderDayComponent(date)}
    />
  );
}
