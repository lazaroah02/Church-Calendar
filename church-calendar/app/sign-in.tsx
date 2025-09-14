import { router, Link } from "expo-router";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSession } from "@/contexts/authContext";

export default function SignIn() {
  const { signIn } = useSession();

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={20} // opcional: espacio extra al enfocar inputs
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

        <TextInput
          placeholder="Número de Teléfono"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
        />

        <Link
          href="/(tabs)/calendar"
          style={{
            alignSelf: "flex-end",
            marginRight: 10,
            marginTop: -10,
            marginBottom: 10,
            fontFamily: "InterVariable",
            fontSize: 14,
            fontWeight: "400",
            opacity: 0.7,
          }}
        >
          ¿Olvidaste tu contraseña?
        </Link>

        <Pressable
          style={styles.loginButton}
          onPress={() => {
            signIn();
            router.replace("/(tabs)/calendar");
          }}
        >
          <Text style={styles.logginButtonText}>Iniciar Sesión</Text>
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
  loginButton: {
    width: 350,
    height: 55,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "600",
    fontFamily: "InterVariable",
  },
});
