import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

export function CheckBox({ label, checked, onCheck }: CheckBoxProps) {
  const styles = useThemeStyles(CheckBoxStyles);
  return (
    <Pressable
      style={styles.checkboxContainer}
      onPress={() => onCheck(!checked)}
    >
      {checked ? (
        <Ionicons name="checkbox-outline" size={25} color="#000" />
      ) : (
        <Ionicons name="square-outline" size={25} color="#000" />
      )}
      <Text style={styles.label}>{label}</Text>
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
      fontSize: theme.fontSizes.lg,
    },
    checkboxContainer: {
      flexDirection: "row",
      gap: 5,
      marginTop: 5,
    },
  };
};
