import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View, Image } from "react-native";
import { MyCustomText } from "../MyCustomText";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { useCustomToast } from "@/hooks/useCustomToast";

export function UserInfoComponent({ user }: { user: UserInfo | undefined }) {
  const styles = useThemeStyles(userInfoStyles);
  const { session } = useSession();
  const isAdmin = session?.userInfo.is_staff;
  const {showSuccessToast} = useCustomToast()

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/*Profile Picture*/}
      <View style={styles.profilePictureContainer}>
        {user?.profile_img ? (
          <Image
            style={styles.profilePicture}
            source={{ uri: getImageUri(user.profile_img) }}
          />
        ) : (
          <Ionicons name="person-outline" size={100} color="#fff" />
        )}
      </View>

      {/*Full Name*/}
      <MyCustomText style={[styles.groupLabel, { marginTop: 20 }]}>
        Nombre:
      </MyCustomText>
      <View style={styles.nameContainer}>
        <MyCustomText style={styles.name}>{user?.full_name}</MyCustomText>
        {user?.is_staff && (
          <Ionicons name="checkmark-circle" size={20} color="fff" />
        )}
      </View>

      {session?.userInfo.id === user?.id ||
        (session?.userInfo.is_staff && (
          <>
            {/*Phone*/}
            <MyCustomText style={styles.groupLabel}>Teléfono:</MyCustomText>
            <MyCustomText style={styles.description}>
              {user?.phone_number}
            </MyCustomText>

            {/*Email*/}
            <MyCustomText style={styles.groupLabel}>Correo:</MyCustomText>
            <MyCustomText style={styles.description}>
              {user?.email}
            </MyCustomText>
          </>
        ))}

      {/*Description*/}
      <MyCustomText style={styles.groupLabel}>Descripción:</MyCustomText>
      <MyCustomText style={styles.description}>
        {user?.description}
      </MyCustomText>

      {/* Groups */}
      <MyCustomText style={styles.groupLabel}>Grupos:</MyCustomText>
      <View style={styles.groupsContainer}>
        {user.member_groups_full_info?.map((group) => (
          <View key={group.name} style={styles.group}>
            <View
              style={[
                styles.groupColor,
                { backgroundColor: group.color || "#ccc" },
              ]}
            />
            <MyCustomText style={styles.groupName}>{group.name}</MyCustomText>
          </View>
        ))}
      </View>

      {/*Access and Permissions*/}
      {isAdmin && (
        <>
          <MyCustomText style={styles.groupLabel}>
            Acceso y Permisos:
          </MyCustomText>
          <MyCustomText style={styles.groupName}>
            {user?.is_active
              ? "Tiene acceso a la aplicación"
              : "No tiene acceso a la aplicación"}
          </MyCustomText>
          <MyCustomText style={styles.groupName}>
            {user?.is_staff ? "Es administrador" : "No es administrador"}
          </MyCustomText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginTop: 20,
            }}
          >
            <MyCustomText style={styles.groupLabel}>FCM Token:</MyCustomText>
            <Ionicons
              name="copy-outline"
              size={20}
              color="#000"
              style={{ marginTop: 15 }}
              onPress={() => {
                copyToClipboard(user?.fcm_token || "")
                showSuccessToast({message: "Token copiado al portapapeles"})
              }}
            />
          </View>
          <MyCustomText style={styles.description}>
            {user?.fcm_token}
          </MyCustomText>
        </>
      )}
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
      backgroundColor: "#6a7073ff",
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
      justifyContent: "flex-start",
      gap: 5,
    },
    name: {
      fontWeight: 600,
      fontSize: theme.fontSizes.md,
      color: "#000",
      fontFamily: "InterVariable",
    },
    description: {
      fontSize: theme.fontSizes.md,
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
      fontSize: theme.fontSizes.md,
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
