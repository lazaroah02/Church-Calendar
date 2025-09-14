import { UserTopBar } from "@/components/UserTopBar";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarComponent,
  DateData,
  LocaleConfig,
  CalendarUtils,
} from "react-native-calendars";

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
  const [selectedDay, setSelectedDay] = useState<DateData>();
  const snapPoints = useMemo(() => ["45%", "95%"], []);
  const today = CalendarUtils.getCalendarDateString(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <UserTopBar />
      <CalendarComponent
        firstDay={1}
        dayComponent={(date) => {
          return (
            <Pressable
              onPress={() => {
                setSelectedDay(date.date);
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
                {width:30, height:30, justifyContent:"center", alignItems:"center"}
              ]}
            >
              <Text>{date.date?.day}</Text>
            </Pressable>
          );
        }}
      />
      <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints}>
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>Martes 9 de Septiembre, 2025</Text>
          <Text>8:00 - 10:00 Reunión de caballeros</Text>
          <Text>10:00 - 10:40 Escuela Dominical</Text>
          <Text>10:40 - 1:00 2do Culto Principal</Text>
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
