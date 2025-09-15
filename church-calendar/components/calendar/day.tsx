import { Pressable, Text } from "react-native";
import { useEvents } from "@/hooks/events/useEvents";
import type { DayProps } from "@/types/calendar";

export function Day({ today, date, selectedDay, setSelectedDay, getSpecificDayEvents }: DayProps) {
  const { events } = useEvents();
  return (
    <Pressable
      onPress={() => {
        if (date.date == null) return;
        setSelectedDay(date.date);
        getSpecificDayEvents({
          date: date.date.dateString,
          dispatchStateUpdate: true,
        });
      }}
      disabled={date.state === "disabled"}
      style={[
        date.state === "disabled" && { opacity: 0.5 },
        date.date?.dateString === today && {
          backgroundColor: "blue",
        },
        date.date?.dateString === selectedDay?.dateString && {
          backgroundColor: "red",
        },
        {
          width: 30,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>{date.date?.day}</Text>
      {date.date?.dateString &&
        events[date.date.dateString] != null &&
        getSpecificDayEvents({ date: date.date.dateString })
          ?.splice(0, 2)
          ?.map((event) => <Text key={event.id}>.</Text>)}
    </Pressable>
  );
}
