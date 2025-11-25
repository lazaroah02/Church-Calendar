import { useConfirm } from "@/hooks/useConfirm";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export function BulkDeleteUsersFromGroupButton({
  selected,
  clearSelected,
}: {
  selected: any[];
  clearSelected: () => void;
}) {
  const styles = useThemeStyles(Styles);
  const { showConfirm, hideConfirm, confirm } = useConfirm({
    onConfirm: () => null,
    onCancel: clearSelected,
    loading: false,
  });
  return (
    <>
    {confirm()}
  {selected.length > 0 && (
    <Pressable onPress={showConfirm} style={styles.deleteSelectedButton}>
      <Ionicons name="trash-outline" size={27} color="white" />
    </Pressable>
  )}
    </>
  );
}

const Styles = (theme: AppTheme) => {
  return {
    deleteSelectedButton: {
      width: 40,
      height: 40,
      position: "absolute",
      bottom: 80,
      left: "60%",
      borderRadius: "100%",
      backgroundColor: "rgba(114, 19, 19, 0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
  };
};
