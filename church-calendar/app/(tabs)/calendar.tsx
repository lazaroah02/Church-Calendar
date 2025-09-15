import { UserTopBar } from "@/components/UserTopBar";
import { Pressable, StyleSheet, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarComponent,
  DateData,
  LocaleConfig,
  CalendarUtils,
} from "react-native-calendars";
import { useEvents } from "@/hooks/events/useEvents";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Marz",
    "Abril",
    "May",
    "Jun",
    "Jul",
    "Agos",
    "Sept",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "es";

export default function Calendar() {
  const sheetRef = useRef<BottomSheet>(null);
  const today = CalendarUtils.getCalendarDateString(new Date());
  const [selectedDay, setSelectedDay] = useState<DateData>({
    dateString: today,
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    timestamp: new Date().getTime(),
  });
  const snapPoints = useMemo(() => ["45%", "95%"], []);
  const { events, setInterval, selectedDayEvents, getSpecificDayEvents } =
    useEvents();
  return (
    <SafeAreaView style={styles.container}>
      <UserTopBar />
      <CalendarComponent
        firstDay={1}
        onMonthChange={(month) => {
          const start_date = `${month.year}-${month.month
            .toString()
            .padStart(2, "0")}-01`;
          const end_date = `${month.year}-${month.month
            .toString()
            .padStart(2, "0")}-${new Date(
            month.year,
            month.month,
            0
          ).getDate()}`;
          setInterval({ start_date, end_date });
        }}
        dayComponent={(date) => {
          return (
            <Pressable
              onPress={() => {
                if (date.date == null) return;
                setSelectedDay(date.date);
                getSpecificDayEvents({
                  date: date.date.dateString,
                  dispatchStateUpdate: true,
                });
              }}
              disabled={date.state === "disabled"}
              style={[
                date.state === "disabled" && { opacity: 0.5 },
                date.date?.dateString === today && {
                  backgroundColor: "blue",
                },
                date.date?.dateString === selectedDay?.dateString && {
                  backgroundColor: "red",
                },
                {
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text>{date.date?.day}</Text>
              {date.date?.dateString &&
                events[date.date.dateString] != null &&
                getSpecificDayEvents({ date: date.date.dateString })
                  ?.splice(0, 2)
                  ?.map((event) => <Text key={event.id}>.</Text>)}
            </Pressable>
          );
        }}
      />
      <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints}>
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>
            {selectedDay.day} de {selectedDay.month}, {selectedDay.year}
          </Text>
          {selectedDayEvents != null && selectedDayEvents.length > 0 ? (
            selectedDayEvents?.map((event) => (
              <Text key={event.id}>{event.title}</Text>
            ))
          ) : (
            <Text>No hay eventos</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
