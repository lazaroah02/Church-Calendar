import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { MyCustomText } from "../MyCustomText";

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  disabled?: boolean
  variant?: "strong" | "light";
}

export function CheckBox({ label, checked, onCheck, disabled = false, variant = "strong" }: CheckBoxProps) {
  const styles = useThemeStyles(CheckBoxStyles);
  return (
    <Pressable
      style={styles.checkboxContainer}
      onPress={() => !disabled && onCheck(!checked)}
    >
      {checked ? (
        <Ionicons name="checkbox-outline" size={25} color="#000" />
      ) : (
        <Ionicons name="square-outline" size={25} color="#000" />
      )}
      <MyCustomText style={[styles.label, variant === "light"? {fontWeight:"500"}:{}]}>{label}</MyCustomText>
    </Pressable>
  );
}

const CheckBoxStyles = (theme: AppTheme) => {
  return {
    label: {
      fontWeight: "700",
      marginBottom: 5,
      color: "#000",
      fontFamily: "InterVariable",
      fontSize: theme.fontSizes.md,
    },
    checkboxContainer: {
      flexDirection: "row",
      gap: 5,
      marginTop: 5,
    },
  };
};
