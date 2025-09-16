import BottomSheet, {
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Text, StyleSheet, View } from "react-native";
import { DateData } from "react-native-calendars";
import { Event } from "@/types/event";
import {
  formatSelectedDay,
  formatTimeRange,
} from "@/lib/calendar/calendar-utils";

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

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTime}>
        {formatTimeRange(item.start_time, item.end_time)}
      </Text>
      <View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.groups}>
          {item.groups_full_info?.map((group, i) => (
            <View
              key={i}
              style={[
                styles.group,
                {
                  backgroundColor: group.color !== "" ? group.color : "#eee",
                },
              ]}
            >
              <Text style={styles.tagText}>{group.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableContentPanningGesture={true}
    >
      {selectedDayEvents?.length ? (
        <BottomSheetFlatList
          data={selectedDayEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          style={styles.content}
          ListHeaderComponent={
            <Text style={styles.title}>
              {formatSelectedDay(selectedDay.dateString)}
            </Text>
          }
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>
            {formatSelectedDay(selectedDay.dateString)}
          </Text>
          <Text style={styles.noEvents}>No hay eventos</Text>
        </View>
      )}
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
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  eventCard: {
    marginBottom: 15,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  groups: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  group: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#fff",
  },
  noEvents: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
