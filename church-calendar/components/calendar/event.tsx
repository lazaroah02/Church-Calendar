import { Text, StyleSheet, View } from "react-native";
import { Event } from "@/types/event";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";

export function EventComponent({ item }: { item: Event }) {
  return (
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
}

const styles = StyleSheet.create({
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
});
