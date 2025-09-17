import { UserTopBar } from "@/components/UserTopBar";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { CalendarUtils } from "react-native-calendars";
import { CalendarComponent } from "@/components/calendar/calendar";
import { useEvents } from "@/hooks/events/useEvents";
import { Day } from "@/components/calendar/day";
import "@/lib/calendar/calendar-locale";
import { EventsBottomSheet } from "@/components/calendar/events-bottom-sheet";
import { StatusBar } from "expo-status-bar";

export default function Calendar() {
  const todaysDate = new Date();
  const today = CalendarUtils.getCalendarDateString(todaysDate);

  const {
    setInterval,
    selectedDayEvents,
    getSpecificDayEvents,
    onRefetch,
    selectedDay,
    setSelectedDay,
  } = useEvents();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefetch()
    setRefreshing(false);
  }, [onRefetch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
      </ScrollView>
      <EventsBottomSheet
        selectedDay={selectedDay}
        selectedDayEvents={selectedDayEvents}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
});
