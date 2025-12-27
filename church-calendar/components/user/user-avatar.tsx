import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View, Image } from "react-native";
import { MyCustomText } from "../MyCustomText";

export const UserAvatar = ({
  title,
  user,
  onPress = (user) =>
    router.push({
      pathname: "/user/detail",
      params: {
        userInfo: JSON.stringify(user),
      },
    }),
  onLongPress = () => null,
  pressableStyle = {},
}: {
  title?: string;
  user?: UserInfo;
  onPress?: (user: UserInfo | undefined) => void;
  onLongPress?: (user: UserInfo | undefined) => void;
  pressableStyle?: object;
}) => {
  const styles = useThemeStyles(UserAvatarStyles);
  return (
    <>
      {title != null? <MyCustomText style={styles.label}>{title}</MyCustomText> : null}

      <Pressable
        onPress={() => onPress(user)}
        onLongPress={() => onLongPress(user)}
        style={[styles.createdByContainer, pressableStyle]}
      >
        <View style={styles.profilePictureContainer}>
          {user?.profile_img ? (
            <Image
              style={styles.profilePicture}
              source={{
                uri: getImageUri(user?.profile_img),
              }}
            />
          ) : (
            <Ionicons name="person-outline" size={22} color="#fff" />
          )}
        </View>
        <MyCustomText style={styles.userName}>
          {user?.full_name || user?.username || user?.email.split("@")[0]}
        </MyCustomText>
      </Pressable>
    </>
  );
};

const UserAvatarStyles = (theme: AppTheme) => ({
  createdByContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  label: {
    fontWeight: "900",
    marginBottom: 5,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
  },
  profilePictureContainer: {
    backgroundColor: "#6a7073ff",
    width: 35,
    height: 35,
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
});
