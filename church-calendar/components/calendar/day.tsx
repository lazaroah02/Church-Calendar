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
        },
        date.state === "disabled" && { opacity: 0.3 },
      ]}
    >
      <Text>{date.date?.day}</Text>

      {/* Barras de colores para eventos */}
      <View style={{ flexDirection: "row", marginTop: 2 }}>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 2,
  },
});
