import { Dispatch, JSX, SetStateAction } from "react";
import type { DateData } from "react-native-calendars";
import type { DateString, Event, Interval } from "@/types/event";

export type DayProps = {
  today: string;
  date: any;
  selectedDay: DateData;
  setSelectedDay: Dispatch<SetStateAction<DateData>>;
  getSpecificDayEvents: (date: DateString) => Event[];
};

export interface CalendarComponentProps {
    setInterval: Dispatch<SetStateAction<Interval>>
    renderDayComponent: (date: any) => JSX.Element
    initialSelectedDay: DateData | null | undefined
}