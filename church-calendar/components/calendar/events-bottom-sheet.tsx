import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import { DateData } from "react-native-calendars";
import { Event } from "@/types/event";
import { formatSelectedDay } from "@/lib/calendar/calendar-utils";
import { EventComponent } from "./event";

interface EventsBottomSheetProps {
  selectedDay: DateData;
  selectedDayEvents: Event[] | undefined;
}

export function EventsBottomSheet({
  selectedDay,
  selectedDayEvents,
}: EventsBottomSheetProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%", "95%"], []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableContentPanningGesture={true}
    >
      <BottomSheetFlatList
        data={selectedDayEvents}
        renderItem={(item) => <EventComponent item={item.item} />}
        ListEmptyComponent={<Text style={styles.noEvents}>No hay eventos</Text>}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.content}
        ListHeaderComponent={
          <Text style={styles.title}>
            {formatSelectedDay(selectedDay.dateString)}
          </Text>
        }
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 40,
    minHeight:"35%" // Ensure minimum height is the same as first snap point
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  noEvents: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
