import { StyleSheet, View, Text } from "react-native";
import { useSession } from "@/hooks/auth/useSession";

export function UserTopBar() {
  const { session } = useSession();
  return (
    <View style={styles.container}>
      <View style={styles.profilePicture}></View>
      <View>
        <Text style={styles.userName}>
          Hola,{" "}
          {session == null
            ? "Invitado"
            : session.userInfo?.full_name || session.userInfo?.email}
        </Text>
        <Text style={styles.welcomeMessage}>Dios te Bendiga!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    backgroundColor: "#fff",
    width: "100%",
    height: 60,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  profilePicture: {
    backgroundColor: "#37C6FF",
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  userName: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: 15,
    fontWeight: 500,
  },
  welcomeMessage: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: 15,
    fontWeight: 400,
    opacity: 0.5,
  },
});
