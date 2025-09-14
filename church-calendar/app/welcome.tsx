import { Link } from "expo-router";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { navigate } from "expo-router/build/global-state/routing";

export default function Welcome() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 350, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("@/assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style = {styles.title}>La Resurrección Calendar</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.containerTitle}>Bienvenido</Text>
        <Text style={styles.containerwelcomeMessage}>Aquí encontrarás todos los eventos disponibles de forma fácil y rápida.</Text>
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            navigate("/sign-in");
          }}
        >
          <Text style={styles.logginButtonText}>Iniciar Sesión</Text>
        </Pressable>
        <Pressable
          style={styles.registerButton}
          onPress={() => {
            navigate("/register");
          }}
        >
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </Pressable>
        <Link
          href="/(tabs)/calendar"
          style={{
            fontSize: 14,
            fontWeight: 500,
            opacity: 0.7,
            color:"#fff",
            textShadowColor: "rgba(0, 0, 0, 0.25)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
            fontFamily: "LexendBold",
            lineHeight: 15,
            marginTop: 10,
          }}
        >
          Continuar como invitado
        </Link>
      </View>
      <StatusBar barStyle={"dark-content"} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 130
  },
  title:{
    width: 200,
    textAlign: "center",
    color: "#442525",
    fontFamily: "LexendBold",
    fontSize: 20,
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
    fontSize: 35,
    fontWeight: 900,
    marginTop: 20,
    marginBottom: 10,
  },
  containerwelcomeMessage: {
    alignSelf: "center",
    textAlign:"center",
    color: "#FFF",
    fontFamily: "LexendBold",
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "InterVariable",
  },
  registerButton: {
    width: 350,
    height: 55,
    backgroundColor: "#673838",
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
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "InterVariable",
  },
});
