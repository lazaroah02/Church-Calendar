import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/contexts/authContext";
import { Link } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";

export default function Settings() {
  const { signOut } = useSession();
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Opciones</Text>
      </ScrollView>
      <Pressable
        style={styles.signOutButton}
        onPress={() => {
          signOut();
          navigate("/welcome");
        }}
      >
        <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flexGrow:1,
    height:"90%",
    padding:10
  },
  title:{
    width: 200,
    textAlign: "center",
    color: "#000",
    fontFamily: "InterBold",
    fontSize: 25,
    fontWeight: "700",
  },
  signOutButton: {
    alignSelf:"center",
    width: 330,
    height: 55,
    backgroundColor: "#B5B5B5",
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
  signOutButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "InterMedium",
  },
});
