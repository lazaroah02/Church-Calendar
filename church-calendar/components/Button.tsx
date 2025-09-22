import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { ReactNode } from "react";
import {
  Falsy,
  Pressable,
  RecursiveArray,
  RegisteredStyle,
  Text,
  ViewStyle,
} from "react-native";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export function Button({
  children,
  text,
  variant = "cancel",
  style = {},
  onPress,
}: ButtonProps) {
  const styles = useThemeStyles(ButtonStyles);
  return (
    <Pressable onPress={onPress} style={[styles[variant].button, style]}>
      {children ? children : <Text style={styles[variant].text}>{text}</Text>}
    </Pressable>
  );
}

interface ButtonProps {
  children?: ReactNode;
  text: string;
  variant?: "cancel";
  onPress: () => void;
  style?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
}

const ButtonStyles = (theme: AppTheme) => ({
  cancel: {
    button: {
      alignSelf: "center",
      width: 330,
      height: 55,
      backgroundColor: "rgba(181, 181, 181, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
      marginVertical: 10,
    },
    text: {
      color: "#000",
      fontSize: theme.fontSizes.md,
      fontWeight: "500",
      fontFamily: "InterVariable",
    },
  },
});
