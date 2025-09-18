import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardTypeOptions, TextInput, View } from "react-native";

export function CustomInput({
  error,
  keyboardType = "default",
  placeholder = "",
  secureTextEntry = false,
  onChangeText = () => null,
}: CustomInputProps) {
  const styles = useThemeStyles(customInputStyles)
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error && styles.inputError]}
        onChangeText={onChangeText}
      />
      {error && (
        <Ionicons
          name="alert-circle"
          size={18}
          color="#b91c1c"
          style={styles.errorIcon}
        />
      )}
    </View>
  );
}

const customInputStyles = (theme: AppTheme) =>({
  inputContainer: {
    position: "relative",
    marginVertical: 10,
    width: 330,
    height: 50,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: "400",
  },
  inputError: {
    borderWidth: 2,
    borderColor: "rgb(215, 0, 75)",
  },
  errorIcon: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
});

interface CustomInputProps {
  error: string | null | undefined;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText?: (newValue: string) => void;
}
