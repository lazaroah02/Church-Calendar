import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Animated, Pressable, View, Text } from "react-native";
import { CustomBottomSheetBackground } from "../calendar/events-bottom-sheet";

export function UserFiltersBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["95%"], []);

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
        <View></View>
      </BottomSheetScrollView>
    </BottomSheet>
  );

  const openUserFiltersBottomSheetButton = () => (
    <Pressable onPress={() => openUserFiltersBottomSheet()}>
      <Ionicons name="filter-outline" size={22} color="black" />
    </Pressable>
  );

  const openUserFiltersBottomSheet = () => {
    sheetRef.current?.expand();
  };

  const closeUserFiltersBottomSheet = () => {
    sheetRef.current?.close();
  };
  
  return {
    userFiltersBottomSheet,
    openUserFiltersBottomSheet,
  };
}

const bottomSheetStyles = (theme: AppTheme) => ({
  content: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 40,
    minHeight: "40%", // Ensure minimum height is the same as first snap point
  },
  title: {
    marginBottom: 15,
    color: "#444",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
  },
});
