import { useState } from "react";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  Falsy,
  RecursiveArray,
  RegisteredStyle,
  ViewStyle,
  TextInput,
  View,
  TextInputProps,
  Pressable,
} from "react-native";

export function CustomInput({
  error,
  inputStyle = {},
  containerStyle = {},
  isPassword = false,
  ...props
}: CustomInputProps) {
  const styles = useThemeStyles(customInputStyles);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle, error && styles.inputError]}
        secureTextEntry={isPassword && !showPassword}
        placeholderTextColor={"#000"}
        allowFontScaling={false}
        {...props}
      />

      {/* Icono de toggle contraseña */}
      {isPassword && (
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#333"
          />
        </Pressable>
      )}

      {/* Icono de error */}
      {error && (
        <Ionicons
          name="alert-circle"
          size={18}
          color="#b91c1c"
          style={[styles.errorIcon, isPassword && { right: 35 }]}
        />
      )}
    </View>
  );
}

const customInputStyles = (theme: AppTheme) => ({
  inputContainer: {
    position: "relative",
    marginVertical: 10,
    minWidth: 330,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
    fontWeight: "400",
    height: "100%",
  },
  inputError: {
    borderWidth: 2,
    borderColor: "rgb(215, 0, 75)",
  },
  iconContainer: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: "-50%" }],
    padding: 5,
  },
  errorIcon: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
});

interface CustomInputProps extends TextInputProps {
  error?: string | null;
  isPassword?: boolean;
  containerStyle?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
  inputStyle?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
}
