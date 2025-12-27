import "@/lib/calendar/calendar-locale";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { Calendar } from "react-native-calendars";
import { CalendarComponentProps } from "@/types/calendar";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyCustomText } from "../MyCustomText";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export function CalendarComponent({
  setInterval,
  renderDayComponent,
  initialSelectedDay,
}: CalendarComponentProps) {
  const styles = useThemeStyles(CalendarComponentStyles)
  return (
    <Calendar
      initialDate={initialSelectedDay?.dateString}
      firstDay={1}
      onMonthChange={(month) => {
        setInterval(getMonthIntervalFromDate(new Date(month.dateString)));
      }}
      dayComponent={(date) => renderDayComponent(date)}
      theme={{
        textDayHeaderFontSize: 18,
        textDayHeaderFontWeight: "900",
        textDayHeaderFontFamily: "InterVariable",
        textSectionTitleColor: "#000",
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
            <MyCustomText style={styles.month}>{month}</MyCustomText>
            <MyCustomText style={styles.year}>{year}</MyCustomText>
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

const CalendarComponentStyles = (theme:AppTheme) =>({
  header: {
    alignItems: "center",
    marginVertical: 10,
  },
  month: {
    textTransform: "capitalize",
    color: "#343434",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.xl,
    fontWeight: 900,
  },
  year: {
    fontSize: theme.fontSizes.lg,
    color: "rgba(236, 161, 0, 1)",
    marginTop: -2,
    fontFamily: "InterVariable",
    fontWeight: 900,
  },
});
