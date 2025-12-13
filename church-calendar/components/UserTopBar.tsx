import { View, Image, Pressable } from "react-native";
import { useSession } from "@/hooks/auth/useSession";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getImageUri } from "@/lib/get-image-uri";
import { getFirstWord, truncText } from "@/lib/text-manipulation";
import { MyCustomText } from "./MyCustomText";
import { useAppTheme } from "@/contexts/theme-context";
import { useMemo } from "react";

export function UserTopBar() {
  const { session } = useSession();
  const styles = useThemeStyles(userTopBarStyles);
  const theme = useAppTheme();
  const normalThemeSize = useMemo(() => theme.themeName === "normal", [theme]);
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.profileContainer}
        onPress={() =>
          session &&
          router.push({
            pathname: "/user/profile",
          })
        }
      >
        <View style={styles.profilePictureContainer}>
          {session?.userInfo.profile_img ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: getImageUri(session.userInfo.profile_img) }}
            />
          ) : (
            <Ionicons name="person-outline" size={30} color="#fff" />
          )}
        </View>
        <View>
          <MyCustomText
            style={styles.userName}
            numberOfLines={2}
            ellipsizeMode={"tail"}
          >
            Hola
            {session == null
              ? ", Invitado"
              : `, ${truncText(getFirstWord(session.userInfo?.full_name), 10)}`}
          </MyCustomText>
          <MyCustomText style={styles.welcomeMessage}>
            Dios te Bendiga!
          </MyCustomText>
        </View>
      </Pressable>
      {session?.userInfo.is_staff && (
        <View style={styles.createEventButtonContainer}>
          <Pressable
            style={styles.createEventButton}
            onPress={() => router.push("/event/create")}
          >
            <Ionicons name="add" size={normalThemeSize ? 23 : 30}/>
            <MyCustomText style={styles.createEventButtonText}>
              Evento
            </MyCustomText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const userTopBarStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  profileContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    height: 60,
    padding: 10,
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
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,
    opacity: 0.5,
  },
  createEventButtonContainer: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  createEventButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FFAE00",
    borderRadius: 100,
    padding: 10,
  },
  createEventButtonText: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
    fontWeight: 900,
  },
});
