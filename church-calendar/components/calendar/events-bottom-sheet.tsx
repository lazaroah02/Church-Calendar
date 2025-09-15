import { Event } from "@/types/event";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import { DateData } from "react-native-calendars";

interface EventsBottomSheetProps{
    selectedDay: DateData,
    selectedDayEvents: Event[] | undefined
}

export function EventsBottomSheet({selectedDay, selectedDayEvents}: EventsBottomSheetProps) {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["45%", "95%"], []);

  return (
    <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints}>
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>
          {selectedDay.day} de {selectedDay.month}, {selectedDay.year}
        </Text>
        {selectedDayEvents != null && selectedDayEvents.length > 0 ? (
          selectedDayEvents?.map((event: Event) => (
            <Text key={event.id}>{event.title}</Text>
          ))
        ) : (
          <Text>No hay eventos</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});