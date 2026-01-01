import { Pressable, View } from "react-native";
import type { DayProps } from "@/types/calendar";
import { MyCustomText } from "../MyCustomText";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { useMemo } from "react";

export function Day({
  today,
  date,
  selectedDay,
  setSelectedDay,
  getSpecificDayEvents,
}: DayProps) {
  const dayEvents = getSpecificDayEvents(date.date?.dateString);
  const styles = useThemeStyles(DayComponentStyles);
  const { interval } = useCalendarEventsContext();

  const withinVisibleMonth = useMemo(
    () =>
      date.date &&
      date.date.timestamp >= new Date(interval.start_date).getTime() &&
      date.date.timestamp <= new Date(interval.end_date).getTime(),
    [date.date, interval.end_date, interval.start_date]
  );

  const disabledDay = useMemo(
    () => date.state === "disabled" || !withinVisibleMonth,
    [date.state, withinVisibleMonth]
  );

  return (
    <Pressable
      onPress={() => {
        if (date.date == null) return;
        setSelectedDay(date.date);
      }}
      disabled={disabledDay}
      style={[
        styles.dayContainer,
        date.date?.dateString === today &&
          !disabledDay && {
            backgroundColor: "#fff",
          },
        date.date?.dateString === selectedDay?.dateString && {
          borderWidth: 3,
          borderColor: "rgba(236, 161, 0, 1)",
        },
        disabledDay && { opacity: 0.2 },
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
                    : "#000",
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
          <MyCustomText style={{ textAlign: "center", marginTop: -8 }}>
            ...
          </MyCustomText>
        )}
      </View>
    </Pressable>
  );
}

const DayComponentStyles = (theme: AppTheme) => ({
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
