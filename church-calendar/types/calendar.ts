import { Dispatch, JSX, SetStateAction } from "react";
import type { DateData } from "react-native-calendars";
import type { Event, Interval } from "@/types/event";

export type DayProps = {
  today: string;
  date: any;
  selectedDay: DateData;
  setSelectedDay: Dispatch<SetStateAction<DateData>>;
  getSpecificDayEvents: ({
    date,
    dispatchStateUpdate,
  }: {
    date: string;
    dispatchStateUpdate?: boolean;
  }) => Event[] | undefined;
};

export interface CalendarComponentProps {
    setInterval: Dispatch<SetStateAction<Interval>>
    renderDayComponent: (date: any) => JSX.Element
}