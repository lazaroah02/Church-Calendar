import { View, Pressable, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { navigate } from "expo-router/build/global-state/routing";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { useSession } from "@/hooks/auth/useSession";
import { router } from "expo-router";
import { MyCustomText } from "@/components/MyCustomText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyNavigationBar } from "@/hooks/useMyNavigationBar";

export default function Welcome() {
  const styles = useThemeStyles(welcomeStyles);
  useMyNavigationBar({backgroundColor:"rgba(236, 161, 0, 1)", buttonsStyle:"dark"})
  const { updateGuestStatus } = useSession();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ height: 350, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={require("@/assets/images/Logo.png")}
          style={styles.logo}
        />
        <MyCustomText style={styles.title}>Calendario La Resurrección</MyCustomText>
      </View>
      <View style={styles.container}>
        <MyCustomText style={styles.containerTitle}>Bienvenido</MyCustomText>
        <MyCustomText style={styles.containerwelcomeMessage}>
          Aquí encontrarás todos los eventos disponibles de forma fácil y
          rápida.
        </MyCustomText>
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            navigate("/sign-in");
          }}
        >
          <MyCustomText style={styles.logginButtonText}>Iniciar Sesión</MyCustomText>
        </Pressable>
        <Pressable
          style={styles.registerButton}
          onPress={() => {
            navigate("/register");
          }}
        >
          <MyCustomText style={styles.registerButtonText}>Crear Cuenta</MyCustomText>
        </Pressable>
        <TouchableOpacity
          onPress={() => {
            updateGuestStatus(true);
            router.replace("/(tabs)/calendar");
          }}
          style={styles.continueLikeGuest}
        >
          <MyCustomText style={styles.continueLikeGuestText}>Continuar como invitado</MyCustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const welcomeStyles = (theme: AppTheme) => ({
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
    fontWeight: 700,
  },
  container: {
    flex: 1,
    display: "flex",
    gap: 10,
    alignItems: "center",
    backgroundColor: "rgba(236, 161, 0, 1)",
    padding: 30,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  containerTitle: {
    alignSelf: "center",
    color: "#FFF",
    fontFamily: "InterVariable",
    fontSize: 40,
    fontWeight: 900,
    marginTop: 20,
    marginBottom: 10,
  },
  containerwelcomeMessage: {
    alignSelf: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.md,
    fontWeight: 600,
    marginBottom: 10,
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
    fontSize: theme.fontSizes.md,
    fontWeight: "bold",
    fontFamily: "InterVariable",
  },
  registerButton: {
    width: 350,
    height: 55,
    backgroundColor: "#AD5A00",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: theme.fontSizes.md,
    fontWeight: "bold",
    fontFamily: "InterVariable",
  },
  continueLikeGuest: {
    marginTop: 10,
  },
  continueLikeGuestText:{
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    fontFamily: "LexendBold",
    lineHeight: 15,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    color: "#fff",
    opacity: 0.7,
    padding:1
  }
});
