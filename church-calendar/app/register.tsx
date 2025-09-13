import { router, Link } from "expo-router";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";

import { useSession } from "@/contexts/authContext";
import { Label } from "@react-navigation/elements";

export default function Register() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(236, 161, 0, 1)" }}>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Crear Cuenta</Text>
        <View>
          <Label style={styles.label}>Nombre Completo</Label>
          <TextInput
            style={styles.input}
          />
        </View>
        <View>
        <Label style={styles.label}>Número de Teléfono</Label>
        <TextInput style={styles.input} />
        </View>
        <View>
          <Label style={styles.label}>Contraseña</Label>
          <TextInput
            secureTextEntry
            style={styles.input}
          />
        </View>
        <View>
          <Label style={styles.label}>Repetir Contraseña</Label>
          <TextInput
            secureTextEntry
            style={styles.input}
          />
        </View>
        <View>
          <Label style={styles.label}>Fecha de Nacimiento</Label>
          <TextInput
            style={styles.input}
          />
        </View>
        <Pressable
          style={styles.registerButton}
          onPress={() => {
            signIn();
            router.replace("/");
          }}
        >
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </Pressable>
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
  form: {
    flex: 1,
    display: "flex",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    padding: 30,
    marginTop:50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    alignSelf: "center",
    color: "#442525",
    fontFamily: "InterBold",
    fontSize: 25,
    fontWeight: 900,
    marginTop: 5,
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
    fontFamily: "InterRegular",
    fontSize: 16,
    fontWeight: 400,
  },
  label:{
    alignSelf:"flex-start"
  },
  registerButton: {
    width: 350,
    height: 55,
    backgroundColor: "#AD5A00",
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
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "InterMedium",
  },
});
