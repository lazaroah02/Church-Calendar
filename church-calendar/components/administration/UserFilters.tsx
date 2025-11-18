import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import {
  Animated,
  Pressable,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { CustomBottomSheetBackground } from "../calendar/events-bottom-sheet";
import { CheckBox } from "../form/checkbox";
import { ChurchGroupsPicker } from "../form/church-groups-picker";
import { Button } from "../Button";

export function UserFiltersBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["98%"], []);
  const styles = useThemeStyles(bottomSheetStyles);

  const openUserFiltersBottomSheet = () => {
    sheetRef.current?.expand();
  };

  const closeUserFiltersBottomSheet = () => {
    sheetRef.current?.close();
  };

  const openUserFiltersBottomSheetButton = () => (
    <TouchableOpacity onPress={() => openUserFiltersBottomSheet()}>
      <Ionicons name="filter-outline" size={27} color="black" />
    </TouchableOpacity>
  );

  const userFiltersBottomSheet = () => (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableContentPanningGesture={true}
      backgroundComponent={CustomBottomSheetBackground}
      enablePanDownToClose
    >
      <BottomSheetScrollView>
        <Text style={styles.title}>Filtros</Text>

        <View style={styles.content}>
          <CheckBox
            label="Solo Administradores"
            checked={false}
            onCheck={(checked) => null}
          />
          <CheckBox
            label="No Administradores"
            checked={false}
            onCheck={(checked) => null}
          />
          <CheckBox
            label="Tiene acceso a la aplicación"
            checked={false}
            onCheck={(checked) => null}
          />
          <CheckBox
            label="No tiene acceso a la aplicación"
            checked={false}
            onCheck={(checked) => null}
          />
          <ChurchGroupsPicker
            onChange={(selectedGroups) => null}
            placeholder="Filtrar por grupo"
            containerStyle={{ marginTop: 10 }}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            text="Limpiar"
            onPress={() => {
              closeUserFiltersBottomSheet()
            }}
            style={{ width: "45%" }}
          />
          <Button
            text="Aplicar"
            onPress={() => {
              closeUserFiltersBottomSheet()
            }}
            style={{ width: "50%" }}
            variant="submit"
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );

  return {
    userFiltersBottomSheet,
    openUserFiltersBottomSheetButton,
  };
}

const bottomSheetStyles = (theme: AppTheme) => ({
  title: {
    marginBottom: 15,
    marginLeft: 20,
    color: "#444",
    fontFamily: "InterVariable",
    fontSize: 25,
    fontWeight: 700,
  },
  content: {
    padding: 15,
    gap: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
});
