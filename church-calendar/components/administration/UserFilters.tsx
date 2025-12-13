import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { CustomBottomSheetBackground } from "../calendar/events-bottom-sheet";
import { CheckBox } from "../form/checkbox";
import { ChurchGroupsPicker } from "../form/church-groups-picker";
import { Button } from "../Button";
import { MyCustomText } from "../MyCustomText";

export type UserFilters = {
  is_staff: boolean | "";
  is_active: boolean | "";
  member_groups: (number | undefined)[];
};

export const defaultFiltersValues: UserFilters = {
  is_active: "",
  is_staff: "",
  member_groups: [],
};

export function UserFiltersBottomSheet({
  handleFilterChange,
  defaultFilters,
}: {
  handleFilterChange: (filters: UserFilters) => void;
  defaultFilters: UserFilters;
}) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["98%"], []);
  const styles = useThemeStyles(bottomSheetStyles);

  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [showActiveFiltersStatus, setShowActiveFiltersStatus] = useState(false);

  const openUserFiltersBottomSheet = () => {
    sheetRef.current?.expand();
  };

  const closeUserFiltersBottomSheet = () => {
    sheetRef.current?.close();
  };

  const handleShowActiveFiltersStatus = () => {
    if (
      filters.is_active !== "" ||
      filters.is_staff !== "" ||
      filters.member_groups.length > 0
    ) {
      setShowActiveFiltersStatus(true);
    }else{
      setShowActiveFiltersStatus(false);
    }
  };

  const openUserFiltersBottomSheetButton = () => (
    <TouchableOpacity onPress={() => openUserFiltersBottomSheet()}>
      <Ionicons name="filter-outline" size={27} color="black" />
      {showActiveFiltersStatus ? (
        <View style={styles.filtersActiveIndicator} />
      ) : null}
    </TouchableOpacity>
  );

  const handleChange = (
    key: keyof typeof filters,
    value: string | number[] | boolean
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const [groupsPickerKey, setGroupsPickerKey] = useState(0);

  const resetFilters = () => {
    setFilters(defaultFiltersValues);
    handleFilterChange(defaultFiltersValues);
    closeUserFiltersBottomSheet();
    setGroupsPickerKey((prev) => prev + 1);
    setShowActiveFiltersStatus(false);
  };

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
        <MyCustomText style={styles.title}>Filtros</MyCustomText>

        <View style={styles.content}>
          <CheckBox
            label="Solo Administradores"
            checked={filters.is_staff === "" ? false : filters.is_staff}
            onCheck={(checked) =>
              handleChange("is_staff", checked === false ? "" : true)
            }
            variant="light"
          />
          <CheckBox
            label="No Administradores"
            checked={filters.is_staff === "" ? false : !filters.is_staff}
            onCheck={(checked) =>
              handleChange("is_staff", checked === false ? "" : false)
            }
            variant="light"
          />
          <CheckBox
            label="Tiene acceso a la aplicación"
            checked={filters.is_active === "" ? false : filters.is_active}
            onCheck={(checked) =>
              handleChange("is_active", checked === false ? "" : true)
            }
            variant="light"
          />
          <CheckBox
            label="No tiene acceso a la aplicación"
            checked={filters.is_active === "" ? false : !filters.is_active}
            onCheck={(checked) =>
              handleChange("is_active", checked === false ? "" : false)
            }
            variant="light"
          />
          <ChurchGroupsPicker
            onChange={(selectedGroups) =>
              handleChange("member_groups", selectedGroups)
            }
            key={groupsPickerKey}
            defaultSelectedGroups={filters.member_groups}
            placeholder="Filtrar por grupo"
            containerStyle={{ marginTop: 10 }}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            text="Limpiar"
            onPress={resetFilters}
            style={{ width: "45%" }}
          />
          <Button
            text="Aplicar"
            onPress={() => {
              handleFilterChange(filters);
              closeUserFiltersBottomSheet();
              handleShowActiveFiltersStatus();
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
  filtersActiveIndicator: {
    backgroundColor: "red",
    width: 10,
    height: 10,
    position: "absolute",
    right: 0,
    borderRadius: "100%",
  },
});
