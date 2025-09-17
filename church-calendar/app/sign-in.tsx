import { router, Link } from "expo-router";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSession } from "@/hooks/auth/useSession";
import { useState } from "react";
import { LoginFormErrors } from "@/types/auth";
import FormErrorBanner from "@/components/form-banner-error";

export default function SignIn() {
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ email: string; pass: string }>(
    { email: "", pass: "" }
  );
  const [errors, setErrors] = useState<LoginFormErrors|null>(null);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={100}
    >
      <View
        style={{
          height: 350,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>La Resurrección Calendar</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Iniciar Sesión</Text>
        {errors && (
          <FormErrorBanner
            message={
              errors.email ||
              errors.pass ||
              errors.general ||
              'Ocurrió un error al iniciar sesión.'
            }
          />
        )}
        {/* Email */}
        <TextInput
          placeholder="Correo"
          keyboardType="email-address"
          style={[styles.input, errors?.email && styles.inputError]}
          onChangeText={(newValue) =>
            setFormValues((prev) => ({
              ...prev,
              email: newValue,
            }))
          }
        />

        {/* Password */}
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={[styles.input, errors?.pass && styles.inputError]}
          onChangeText={(newValue) =>
            setFormValues((prev) => ({
              ...prev,
              pass: newValue,
            }))
          }
        />

        <Link href="/(tabs)/calendar" style={styles.forgotPassword}>
          ¿Olvidaste tu contraseña?
        </Link>

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
          <Text style={styles.logginButtonText}>
            {loading ? "Enviando" : "Iniciar Sesión"}
          </Text>
          {loading && <ActivityIndicator size="small" color="#000" />}
        </Pressable>
      </View>

      <StatusBar barStyle={"dark-content"} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 130,
  },
  title: {
    width: 200,
    textAlign: "center",
    color: "#442525",
    fontFamily: "LexendBold",
    fontSize: 20,
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
    fontSize: 25,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    width: 330,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: 16,
    fontWeight: "400",
  },
  inputError: {
    borderWidth: 2,
    borderColor: "rgb(215, 0, 75)",
  },
  loginButton: {
    width: 350,
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
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "InterVariable",
  },
  errorText: {
    color: "rgb(215, 0, 75)",
    marginTop: -15,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: "InterVariable",
    fontWeight: "900",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "InterVariable",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.7,
  },
});
