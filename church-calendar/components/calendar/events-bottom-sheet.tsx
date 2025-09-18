import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Text, StyleSheet, Animated } from "react-native";
import { DateData } from "react-native-calendars";
import { Event } from "@/types/event";
import { formatSelectedDay } from "@/lib/calendar/calendar-utils";
import { EventComponent } from "./event";

export function EventsBottomSheet({
  selectedDay,
  selectedDayEvents,
}: EventsBottomSheetProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "95%"], []);
  const currentDateReadable = formatSelectedDay(selectedDay.dateString);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableContentPanningGesture={true}
      backgroundComponent={CustomBottomSheetBackground}
    >
      <BottomSheetFlatList
        data={selectedDayEvents}
        renderItem={(item) => (
          <EventComponent
            item={item.item}
            currentDateReadable={currentDateReadable}
          />
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>No hay eventos</Text>}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.content}
        ListHeaderComponent={
          <Text style={styles.title}>{currentDateReadable}</Text>
        }
      />
    </BottomSheet>
  );
}

interface EventsBottomSheetProps {
  selectedDay: DateData;
  selectedDayEvents: Event[] | undefined;
}

const CustomBottomSheetBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  // combina el style que el BottomSheet pasa internamente con el tuyo
  const containerStyle = useMemo(
    () => [style, styles.sheetBackground],
    [style]
  );
  return <Animated.View style={containerStyle} />;
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: "hidden", // important to cut corners content
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 40,
    minHeight: "30%", // Ensure minimum height is the same as first snap point
  },
  title: {
    marginBottom: 15,
    color: "#444",
    fontFamily: "InterVariable",
    fontSize: 20,
    fontWeight: 700,
  },
  noEvents: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
