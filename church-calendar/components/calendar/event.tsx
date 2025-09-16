import { Text, StyleSheet, View, Alert, Pressable } from "react-native";
import { Event } from "@/types/event";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";

export function EventComponent({ item }: { item: Event }) {
  return (
    <Pressable onPress={() => Alert.alert(item.title)}>
      <View style={styles.eventCard}>
        <Text style={styles.eventTime}>
          {formatTimeRange(item.start_time, item.end_time)}
        </Text>
        <View>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={styles.groups}>
            {item.groups_full_info?.map((group, i) => (
              <View key={i} style={styles.group}>
                <View
                  style={[
                    styles.groupColor,
                    {
                      backgroundColor:
                        group.color !== "" ? group.color : "#eee",
                    },
                  ]}
                ></View>
                <Text style={styles.groupName}>{group.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: 25,
  },
  eventTime: {
    fontSize: 14,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: 900,
    opacity: 0.5,
  },
  eventTitle: {
    color: "#000",
    fontFamily: "LexendBold",
    fontSize: 15,
    fontWeight: 500,
  },
  groups: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  group: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    paddingLeft: 0,
    borderRadius: 10,
    marginRight: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  groupColor: {
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  groupName: {
    color: "#000",
    fontFamily: "LexendBold",
    fontSize: 13,
    fontWeight: 400,
    opacity: 0.5,
  },
});
