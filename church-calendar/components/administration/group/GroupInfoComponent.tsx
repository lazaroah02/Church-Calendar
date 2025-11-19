import { Button } from "@/components/Button";
import { UserAvatar } from "@/components/event/user-avatar";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View, Image, Text, Pressable } from "react-native";

export function GroupInfoComponent({ group }: { group: Group | null }) {
  const styles = useThemeStyles(groupInfoStyles);

  const {
    users,
    isGettingUsers,
    isGettingMoreUsers,
    hasMoreUsers,
    fetchNextPageOfUsers,
    totalUsers,
  } = useManageUsers({
    filters: { member_groups: [group?.id], is_active: "", is_staff: "" },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/*Group Image*/}
      <View
        style={[
          styles.profilePictureContainer,
          group?.color ? { backgroundColor: group.color } : {},
        ]}
      >
        {group?.img ? (
          <Image
            style={styles.profilePicture}
            source={{ uri: getImageUri(group.img) }}
          />
        ) : (
          <Ionicons name="image-outline" size={100} color="#fff" />
        )}
      </View>

      {/*Group Name*/}
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{group?.name}</Text>
      </View>

      {/*Description*/}
      {group?.description && (
        <>
          <Text style={styles.groupLabel}>Descripción:</Text>
          <Text style={styles.description}>{group?.description}</Text>
        </>
      )}

      {/*Color*/}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <Text style={[styles.groupLabel, { marginTop: 0, marginBottom: 0 }]}>
          Color:
        </Text>
        <View
          style={{
            backgroundColor: group?.color,
            width: 20,
            height: 20,
            borderRadius: "100%",
          }}
        />
      </View>

      {/*Members*/}
      <Text style={styles.groupLabel}>Integrantes ({totalUsers}):</Text>
      {users.map((user) => (
        <UserAvatar key={user.id} user={user} title="" />
      ))}
      {isGettingUsers ||
        (isGettingMoreUsers && (
          <Text style={{ textAlign: "center", marginTop: 15 }}>
            Cargando integrantes...
          </Text>
        ))}
      {users.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          Sin integrantes
        </Text>
      )}
      {hasMoreUsers && !isGettingMoreUsers && !isGettingUsers && (
        <Button
          onPress={() => fetchNextPageOfUsers()}
          style={{ marginTop: 15, alignItems: "center" }}
          variant="cancel"
          text="Cargar más usuarios"
        />
      )}
    </ScrollView>
  );
}

const groupInfoStyles = (theme: AppTheme) => {
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
  };
};
