import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text, Image } from "react-native";

export const GroupAvatar = ({
  group,
  onPress = () => null,
}: {
  group?: Group;
  onPress?: (group: Group | undefined) => void;
}) => {
  const styles = useThemeStyles(GroupAvatarStyles);
  return (
    <>
      <Pressable
        onPress={() => onPress(group)}
        style={styles.createdByContainer}
      >
        <View
          style={[
            styles.profilePictureContainer,
            group?.color ? { backgroundColor: group.color } : {},
          ]}
        >
          {group?.img ? (
            <Image
              style={styles.profilePicture}
              source={{
                uri: getImageUri(group?.img),
              }}
            />
          ) : (
            <Ionicons name="image-outline" size={22} color="#fff" />
          )}
        </View>
        <Text style={styles.groupName}>{group?.name}</Text>
      </Pressable>
    </>
  );
};

const GroupAvatarStyles = (theme: AppTheme) => ({
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
    fontSize: theme.fontSizes.lg,
  },
  profilePictureContainer: {
    backgroundColor: "#37C6FF",
    width: 45,
    height: 45,
    padding: 2,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  groupName: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
  },
});
