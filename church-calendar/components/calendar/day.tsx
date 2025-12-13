import { Pressable, View } from "react-native";
import type { DayProps } from "@/types/calendar";
import { MyCustomText } from "../MyCustomText";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export function Day({
  today,
  date,
  selectedDay,
  setSelectedDay,
  getSpecificDayEvents,
}: DayProps) {
  const dayEvents = getSpecificDayEvents(date.date?.dateString);
  const styles = useThemeStyles(DayComponentStyles)
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
          backgroundColor: "#fff",
        },
        date.state === "disabled" && { opacity: 0.2 },
      ]}
    >
      <MyCustomText style={styles.dayNumber}>{date.date?.day}</MyCustomText>
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
                  event.groups_full_info?.length > 0 &&
                  event.groups_full_info[0]?.color !== ""
                    ? event.groups_full_info[0]?.color
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
          <MyCustomText style={{ textAlign: "center", marginTop: -8 }}>...</MyCustomText>
        )}
      </View>
    </Pressable>
  );
}

const DayComponentStyles = (theme:AppTheme) =>({
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
    fontSize: theme.fontSizes.md,
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
