import { BASE_URL } from "@/api-endpoints";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View, Image, Text } from "react-native";

export function UserInfoComponent({ user }: { user: UserInfo }) {
  const styles = useThemeStyles(userInfoStyles);
  const { session } = useSession();
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/*Profile Picture*/}
      <View style={styles.profilePictureContainer}>
        {user.profile_img ? (
          <Image
            style={styles.profilePicture}
            source={{ uri: `${BASE_URL}${user.profile_img}` }}
          />
        ) : (
          <Ionicons name="person-outline" size={100} color="#fff" />
        )}
      </View>

      {/*Full Name*/}
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{user.full_name}</Text>
        {user.is_staff && 
        <Ionicons name="checkmark-circle" size={20} color="fff" />
        }
      </View>

      {session?.userInfo.id === user.id && (
        <>
          {/*Phone*/}
          <Text style={styles.groupLabel}>Teléfono:</Text>
          <Text style={styles.description}>{user.phone_number}</Text>

          {/*Email*/}
          <Text style={styles.groupLabel}>Correo:</Text>
          <Text style={styles.description}>{user.email}</Text>
        </>
      )}

      {/*Description*/}
      <Text style={styles.groupLabel}>Descripción:</Text>
      <Text style={styles.description}>{user.description}</Text>

      {/* Groups */}
      <Text style={styles.groupLabel}>Grupos:</Text>
      <View style={styles.groupsContainer}>
        {user.member_groups_full_info?.map((group) => (
          <View key={group.name} style={styles.group}>
            <View
              style={[
                styles.groupColor,
                { backgroundColor: group.color || "#ccc" },
              ]}
            />
            <Text style={styles.groupName}>{group.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const userInfoStyles = (theme: AppTheme) => {
  return {
    scrollView: {
      padding: 20,
      backgroundColor: "#fff",
      flexDirection: "column",
    },
    profilePictureContainer: {
      backgroundColor: "#37C6FF",
      width: 200,
      height: 200,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    profilePicture: {
      width: "100%",
      height: "100%",
      borderRadius: 100,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      gap: 5,
    },
    name: {
      fontWeight: 500,
      fontSize: theme.fontSizes.xl,
      color: "#000",
      fontFamily: "LexendBold",
    },
    description: {
      fontSize: theme.fontSizes.lg,
      color: "#000",
      fontFamily: "InterVariable",
      fontWeight: 400,
    },
    groupLabel: {
      fontWeight: 500,
      marginBottom: 5,
      marginTop: 20,
      color: "#000",
      fontFamily: "LexendBold",
      fontSize: theme.fontSizes.lg,
      opacity: 0.8,
    },
    groupsContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    group: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    groupName: {
      color: "#000",
      fontFamily: "InterVariable",
      fontSize: theme.fontSizes.md,
      fontWeight: 400,
    },
    groupColor: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
  };
};
