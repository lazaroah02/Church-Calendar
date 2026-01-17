import { router } from "expo-router";
import { View, Pressable, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSession } from "@/hooks/auth/useSession";
import { useState } from "react";
import { LoginFormErrors } from "@/types/auth";
import FormErrorBanner from "@/components/form/form-banner-error";
import { CustomInput } from "@/components/form/custom-input";
import { openBrowserAsync } from "expo-web-browser";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyCustomText } from "@/components/MyCustomText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyNavigationBar } from "@/hooks/useMyNavigationBar";
import { useConfirm } from "@/hooks/useConfirm";

export default function SignIn() {
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const styles = useThemeStyles(signInStyles);
  useMyNavigationBar({
    buttonsStyle: "dark",
    backgroundColor: "rgba(236, 161, 0, 1)",
  });
  const { confirm, showConfirm } = useConfirm({
    onConfirm: async () => {
      await openBrowserAsync(
        "https://wa.me/+51706583?text=Hola.%20Olvidé%20mi%20contraseña.%20Me%20puedes%20ayudar?"
      );
    },
  });

  const [formValues, setFormValues] = useState<{ email: string; pass: string }>(
    { email: "", pass: "" }
  );
  const [errors, setErrors] = useState<LoginFormErrors | null>(null);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={10}
      >
        <View
          style={{
            height: 300,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/Logo.png")}
            style={styles.logo}
          />
          <MyCustomText style={styles.title}>
            Calendario La Resurrección
          </MyCustomText>
        </View>

        <View style={styles.form}>
          <MyCustomText style={styles.formTitle}>Iniciar Sesión</MyCustomText>
          {errors && (
            <FormErrorBanner
              message={
                errors.email ??
                errors.pass ??
                errors.general ??
                "Ocurrió un error al iniciar sesión."
              }
            />
          )}
          {/* Email */}
          <CustomInput
            error={errors?.email}
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="Correo"
            onChangeText={(newValue) =>
              setFormValues((prev) => ({
                ...prev,
                email: newValue,
              }))
            }
          />
          {/* Password */}
          <CustomInput
            placeholder="Contraseña"
            textContentType="password"
            error={errors?.pass}
            isPassword={true}
            onChangeText={(newValue) =>
              setFormValues((prev) => ({
                ...prev,
                pass: newValue,
              }))
            }
          />

          {confirm({
            title: "Olvidaste tu contraseña?",
            message: "Contacta un administrador para recuperar tu contraseña",
          })}
          <MyCustomText style={styles.forgotPassword} onPress={showConfirm}>
            ¿Olvidaste tu contraseña?
          </MyCustomText>

          <Pressable
            style={styles.loginButton}
            onPress={() => {
              setLoading(true);
              setErrors(null);
              signIn({
                email: formValues.email,
                pass: formValues.pass,
                onLoginSuccess: () => {
                  router.replace("/(tabs)/calendar");
                  setLoading(false);
                },
                onLoginError: (err) => {
                  setErrors(err as LoginFormErrors);
                  setLoading(false);
                },
              });
            }}
          >
            <MyCustomText style={styles.logginButtonText}>
              {loading ? "Enviando" : "Iniciar Sesión"}
            </MyCustomText>
            {loading && <ActivityIndicator size="small" color="#000" />}
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const signInStyles = (theme: AppTheme) => ({
  logo: {
    width: 80,
    height: 130,
  },
  title: {
    width: 200,
    textAlign: "center",
    color: "#442525",
    fontFamily: "LexendBold",
    fontSize: 25,
    fontWeight: "700",
  },
  form: {
    flex: 1,
    display: "flex",
    gap: 10,
    alignItems: "center",
    backgroundColor: "rgba(236, 161, 0, 1)",
    padding: 30,
    borderTopRightRadius: 150,
    borderTopLeftRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    alignSelf: "flex-start",
    color: "#FFF",
    fontFamily: "InterVariable",
    fontSize: 35,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 10,
  },
  loginButton: {
    minWidth: 200,
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 100,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logginButtonText: {
    color: "#442525",
    fontSize: theme.fontSizes.md,
    fontWeight: "900",
    fontFamily: "InterVariable",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.sm,
    fontWeight: "400",
    opacity: 0.7,
    textDecorationLine: "underline",
  },
});
