import { UserTopBar } from "@/components/UserTopBar";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, useRef } from "react";

export default function Calendar() {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  return (
    <SafeAreaView style={styles.container}>
      <UserTopBar />
      <Text>Calendar</Text>
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
