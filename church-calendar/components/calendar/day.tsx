import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DayProps } from "@/types/calendar";

export function Day({
  today,
  date,
  selectedDay,
  setSelectedDay,
  getSpecificDayEvents,
}: DayProps) {
  const dayEvents = date.date?.dateString
    ? getSpecificDayEvents(date.date.dateString)
    : [];

  return (
    <Pressable
      onPress={() => {
        if (date.date == null) return;
        setSelectedDay(date.date);
      }}
      disabled={date.state === "disabled"}
      style={[
        styles.dayContainer,
        date.date?.dateString === today && {
          borderWidth: 2,
          borderColor: "#ccc",
        },
        date.date?.dateString === selectedDay?.dateString && {
          borderWidth: 2,
          borderColor: "#007bff",
          backgroundColor:"#fff"
        },
        date.state === "disabled" && { opacity: 0.2 },
      ]}
    >
      <Text style={styles.dayNumber}>{date.date?.day}</Text>
      <View style={styles.dayEventGroupsContainer}>
        <View style={styles.dayEventGroups}>
          {dayEvents?.slice(0, 3).map((event) => (
            <View
              key={event.id}
              style={{
                width: 6,
                height: 4,
                borderRadius: 2,
                backgroundColor:
                  event.groups_full_info.length > 0 &&
                  event.groups_full_info[0].color !== ""
                    ? event.groups_full_info[0].color
                    : "#f39c12",
                marginHorizontal: 1,
              }}
            />
          ))}
        </View>
        <View style={styles.dayEventGroups}>
          {dayEvents?.slice(3, 6).map((event) => (
            <View
              key={event.id}
              style={{
                width: 6,
                height: 4,
                borderRadius: 2,
                backgroundColor:
                  event.groups_full_info.length > 0 &&
                  event.groups_full_info[0].color !== ""
                    ? event.groups_full_info[0].color
                    : "#f39c12",
                marginHorizontal: 1,
              }}
            />
          ))}
        </View>
        {dayEvents && dayEvents.length > 6 && (
          <Text style={{ textAlign: "center", marginTop: -8 }}>...</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 4,
  },
  dayNumber: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: 16,
    fontWeight: 400,
  },
  dayEventGroupsContainer: {
    flexDirection: "column",
  },
  dayEventGroups: {
    marginTop: 2,
    flexDirection: "row",
  },
});
