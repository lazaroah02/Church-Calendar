import { View, Text, Falsy, ViewStyle, RegisteredStyle, RecursiveArray } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export default function FormErrorBanner({
  message,
  style,
}: FormErrorBannerProps) {
  const styles = useThemeStyles(formBannerErrorStyles);
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="alert-circle" size={18} color="#b91c1c" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const formBannerErrorStyles = (theme: AppTheme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  text: {
    color: "#b91c1c",
    marginLeft: 8,
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
  },
});

interface FormErrorBannerProps{
  message: string;
  style?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
}