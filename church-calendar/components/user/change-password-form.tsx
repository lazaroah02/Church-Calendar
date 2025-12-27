import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View } from "react-native";
import { CustomInput } from "../form/custom-input";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Button } from "../Button";
import FormErrorBanner from "../form/form-banner-error";
import { ChangePasswordFormData } from "@/types/auth";
import { MyCustomText } from "../MyCustomText";

export function ChangePasswordForm({
  onSubmit,
  loading = false,
  error = null,
  hideErrors
}: {
  loading: boolean;
  error: {
    password1: string;
    password2: string;
    general: string;
  } | null;
  onSubmit: ({ password1, password2 }: ChangePasswordFormData) => void;
  hideErrors: () => void
}) {
  const styles = useThemeStyles(changePasswordFormStyles);
  const inputColor = "#EBEBEB";
  const [formValues, setFormValues] = useState({
    password1: "",
    password2: "",
  });

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    hideErrors()
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={100}
    >
      <View style={styles.form}>
        <Ionicons
          name="lock-open-outline"
          size={60}
          style={{ alignSelf: "center", marginBottom:50 }}
        />
        {error && (
          <FormErrorBanner
            message={
              error?.password1 ||
              error?.password2 ||
              error?.general ||
              "Error al cambiar la contraseña"
            }
            style={{marginBottom:0, maxWidth:"100%"}}
          />
        )}
        <MyCustomText style={styles.label}>Nueva Contraseña</MyCustomText>
        <CustomInput
          isPassword={true}
          inputStyle={{ backgroundColor: inputColor }}
          value={formValues.password1}
          onChangeText={(text) => handleChange("password1", text)}
          error={error?.password1}
        />

        <MyCustomText style={styles.label}>Repetir Contraseña</MyCustomText>
        <CustomInput
          isPassword={true}
          inputStyle={{ backgroundColor: inputColor }}
          value={formValues.password2}
          onChangeText={(text) => handleChange("password2", text)}
          error={error?.password2}
        />

        <Button
          style={{ marginTop: 30 }}
          text="Enviar"
          loading={loading}
          loadingText={"Enviando"}
          variant="submit"
          onPress={() => onSubmit(formValues)}
          textStyle={{fontWeight:900}}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const changePasswordFormStyles = (theme: AppTheme) => {
  return {
    scrollView: {
      flexGrow: 1,
      backgroundColor: "#fff",
      flexDirection: "column",
    },
    form: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
      padding:20
    },
    label: {
      fontWeight: 500,
      marginBottom: 5,
      marginTop: 20,
      color: "#000",
      fontFamily: "LexendBold",
      fontSize: theme.fontSizes.md,
      opacity: 0.8,
    },
  };
};
