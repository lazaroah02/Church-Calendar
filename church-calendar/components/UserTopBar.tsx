import { View, Text, Image, Pressable } from "react-native";
import { useSession } from "@/hooks/auth/useSession";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { BASE_URL } from "@/api-endpoints";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function UserTopBar() {
  const { session } = useSession();
  const styles = useThemeStyles(userTopBarStyles);
  return (
    <View>
      <Pressable
        style={styles.container}
        onPress={() =>
          session &&
          router.push({
            pathname: "/user/profile",
            params: {
              userInfo: JSON.stringify(session.userInfo),
            },
          })
        }
      >
        <View style={styles.profilePictureContainer}>
          {session?.userInfo.profile_img ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: `${BASE_URL}${session?.userInfo.profile_img}` }}
            />
          ) : (
            <Ionicons name="person-outline" size={30} color="#fff" />
          )}
        </View>
        <View>
          <Text style={styles.userName}>
            Hola
            {session == null
              ? ", Invitado"
              : `, ${session.userInfo?.full_name}`}
          </Text>
          <Text style={styles.welcomeMessage}>Dios te Bendiga!</Text>
        </View>
      </Pressable>
    </View>
  );
}

const userTopBarStyles = (theme: AppTheme) => ({
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
  profilePictureContainer: {
    backgroundColor: "#37C6FF",
    width: 45,
    height: 45,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  userName: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
  welcomeMessage: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
    fontWeight: 400,
    opacity: 0.5,
  },
});
