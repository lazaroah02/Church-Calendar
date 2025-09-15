import { UserTopBar } from "@/components/UserTopBar";
import { StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { DateData, CalendarUtils } from "react-native-calendars";
import { CalendarComponent } from "@/components/calendar/calendar";
import { useEvents } from "@/hooks/events/useEvents";
import { Day } from "@/components/calendar/day";
import "@/lib/calendar/calendar-locale";
import { EventsBottomSheet } from "@/components/calendar/events-bottom-sheet";

export default function Calendar() {
  const todaysDate = new Date();
  const today = CalendarUtils.getCalendarDateString(todaysDate);
  const [selectedDay, setSelectedDay] = useState<DateData>({
    dateString: today,
    day: todaysDate.getDate(),
    month: todaysDate.getMonth() + 1,
    year: todaysDate.getFullYear(),
    timestamp: todaysDate.getTime(),
  });
  const { setInterval, selectedDayEvents, getSpecificDayEvents } = useEvents();
  return (
    <SafeAreaView style={styles.container}>
      <UserTopBar />
      <CalendarComponent
        setInterval={setInterval}
        renderDayComponent={(date) => (
          <Day
            date={date}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            today={today}
            getSpecificDayEvents={getSpecificDayEvents}
          />
        )}
      />
      <EventsBottomSheet
        selectedDay={selectedDay}
        selectedDayEvents={selectedDayEvents}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
});
