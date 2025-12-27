import { View, Falsy, ViewStyle, RegisteredStyle, RecursiveArray } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { Ref } from "react";
import { MyCustomText } from "../MyCustomText";

export default function FormErrorBanner({
  message,
  style,
  ref
}: FormErrorBannerProps) {
  const styles = useThemeStyles(formBannerErrorStyles);
  if (!message) return null;

  return (
    <View style={[styles.container, style]} ref = {ref}>
      <Ionicons name="alert-circle" size={18} color="#b91c1c" />
      <MyCustomText style={styles.text}>{message}</MyCustomText>
    </View>
  );
}

const formBannerErrorStyles = (theme: AppTheme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
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
    paddingRight: 10
  },
});

interface FormErrorBannerProps{
  message: string;
  ref?: Ref<View> | undefined,
  style?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
}