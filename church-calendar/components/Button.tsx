import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  Falsy,
  Pressable,
  RecursiveArray,
  RegisteredStyle,
  View,
  ViewStyle,
  TextStyle
} from "react-native";
import { MyCustomText } from "./MyCustomText";

export function Button({
  children,
  text,
  loadingText = null,
  loading = false,
  variant = "cancel",
  disabled = false,
  textStyle = {},
  style = {},
  onPress,
}: ButtonProps) {
  const styles = useThemeStyles(ButtonStyles);
  return (
    <Pressable onPress={onPress} style={[styles[variant].button, style]} disabled={disabled}>
      {children ? (
        children
      ) : (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <MyCustomText style={[styles[variant].text, textStyle]}>
            {loadingText && loading ? loadingText : text}
          </MyCustomText>
          {loading && <ActivityIndicator size="small" color="#000" />}
        </View>
      )}
    </Pressable>
  );
}

interface ButtonProps {
  children?: ReactNode;
  text: string;
  variant?: "cancel" | "submit";
  onPress: () => void;
  loading?: boolean;
  loadingText?: string | null;
  disabled?: boolean
  style?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
  textStyle?:
    | Falsy
    | ViewStyle
    | TextStyle
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
  submit: {
    button: {
      alignSelf: "center",
      width: 330,
      height: 55,
      backgroundColor: "rgba(236, 161, 0, 1)",
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
