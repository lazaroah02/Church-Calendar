import "@/lib/calendar/calendar-locale";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { Calendar } from "react-native-calendars";
import { CalendarComponentProps } from "@/types/calendar";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function CalendarComponent({
  setInterval,
  renderDayComponent,
}: CalendarComponentProps) {
  return (
    <Calendar
      firstDay={1}
      onMonthChange={(month) => {
        setInterval(getMonthIntervalFromDate(new Date(month.dateString)));
      }}
      dayComponent={(date) => renderDayComponent(date)}
      theme={{
        textDayHeaderFontSize: 18,
        textDayHeaderFontWeight: "900",
        textDayHeaderFontFamily:"InterVariable",
        textSectionTitleColor:"#000",
        arrowColor: "#000",
        backgroundColor: "transparent",
        calendarBackground: "transparent",
      }}
      headerStyle={{ backgroundColor: "transparent" }}
      renderHeader={(date) => {
        const month = date.toString("MMMM");
        const year = date.toString("yyyy");
        return (
          <View style={styles.header}>
            <Text style={styles.month}>{month}</Text>
            <Text style={styles.year}>{year}</Text>
          </View>
        );
      }}
      renderArrow={(direction) => {
        if (direction === "left") {
          return <Ionicons name="chevron-back" size={20} color="#000" />;
        } else {
          return <Ionicons name="chevron-forward" size={20} color="#000" />;
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginVertical: 10,
  },
  month: {
    textTransform: "capitalize",
    color: "#343434",
    fontFamily: "InterVariable",
    fontSize: 23,
    fontWeight: 900,
  },
  year: {
    fontSize: 15,
    color: "#343434",
    marginTop: -2,
    fontFamily: "InterVariable",
    fontWeight: 400
  },
});
