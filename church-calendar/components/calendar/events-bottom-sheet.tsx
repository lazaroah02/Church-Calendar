import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Animated } from "react-native";
import { DateData } from "react-native-calendars";
import { Event } from "@/types/event";
import { formatSelectedDay } from "@/lib/calendar/calendar-utils";
import { EventComponent } from "./event";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyCustomText } from "../MyCustomText";

export function EventsBottomSheet({
  selectedDay,
  selectedDayEvents,
}: EventsBottomSheetProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "25%", "95%"], []);
  const currentDateReadable = formatSelectedDay(selectedDay.dateString);
  const styles = useThemeStyles(bottomSheetStyles);

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      enableContentPanningGesture={true}
      backgroundComponent={CustomBottomSheetBackground}
    >
      <BottomSheetFlatList
        data={selectedDayEvents}
        renderItem={(item) => (
          <EventComponent
            item={item.item}
          />
        )}
        ListEmptyComponent={<MyCustomText style={styles.noEvents}>No hay eventos</MyCustomText>}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.content}
        ListHeaderComponent={
          <MyCustomText style={styles.title}>{currentDateReadable}</MyCustomText>
        }
      />
    </BottomSheet>
  );
}

interface EventsBottomSheetProps {
  selectedDay: DateData;
  selectedDayEvents: Event[] | undefined;
}

export const CustomBottomSheetBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  const styles = useThemeStyles(bottomSheetStyles);
  const containerStyle = useMemo(
    () => [style, styles.sheetBackground],
    [style]
  );
  return <Animated.View style={containerStyle} />;
};

const bottomSheetStyles = (theme: AppTheme) => ({
  sheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    minHeight: "15%", // Ensure minimum height is the same as first snap point
  },
  title: {
    marginBottom: 15,
    color: "rgba(236, 161, 0, 1)",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
    fontWeight: 700,
    opacity:0.8
  },
  noEvents: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    fontSize: theme.fontSizes.sm,
  },
});
