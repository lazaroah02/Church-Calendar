import { UserTopBar } from "@/components/UserTopBar";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useEffect } from "react";
import { CalendarUtils } from "react-native-calendars";
import { CalendarComponent } from "@/components/calendar/calendar";
import { Day } from "@/components/calendar/day";
import "@/lib/calendar/calendar-locale";
import { EventsBottomSheet } from "@/components/calendar/events-bottom-sheet";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { useSelectedDayFromParams } from "@/hooks/calendar/useSelectedDayFromParams";
import { router } from "expo-router";

export default function Calendar() {
  const todaysDate = new Date();
  const today = CalendarUtils.getCalendarDateString(todaysDate);

  const selectedDayParam = useSelectedDayFromParams();

  const {
    setInterval,
    selectedDayEvents,
    getSpecificDayEvents,
    onRefetch,
    selectedDay,
    setSelectedDay,
  } = useCalendarEventsContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefetch();
    setRefreshing(false);
  }, [onRefetch]);

  useEffect(() => {
    if (!selectedDayParam) return;

    setSelectedDay(selectedDayParam);

    // Remove the param so the effect doesn't re-fire
    router.setParams({ selectedDayParam: undefined });
  }, [selectedDayParam, setSelectedDay]);

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
          selectedDay={selectedDay}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
});
