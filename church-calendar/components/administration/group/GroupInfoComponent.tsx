import { Button } from "@/components/Button";
import { UserAvatar } from "@/components/user/user-avatar";
import { useSelectedItems } from "@/hooks/administration/useSelectedItems";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, View, Image, Pressable } from "react-native";
import { BulkDeleteUsersFromGroupButton } from "./BulkDeleteUsersFromGroupButton";
import { MyCustomText } from "@/components/MyCustomText";

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

  const { selected, clearSelected, toggleSelect } = useSelectedItems<
    number | undefined
  >();

  return (
    <>
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
          <MyCustomText style={styles.name}>{group?.name}</MyCustomText>
        </View>

        {/*Description*/}
        {group?.description && (
          <>
            <MyCustomText style={styles.groupLabel}>Descripción:</MyCustomText>
            <MyCustomText style={styles.description}>{group?.description}</MyCustomText>
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
          <MyCustomText style={[styles.groupLabel, { marginTop: 0, marginBottom: 0 }]}>
            Color:
          </MyCustomText>
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
        <MyCustomText style={styles.groupLabel}>Integrantes ({totalUsers}):</MyCustomText>
        {users.map((user) => {
          const isSelected = selected.includes(user.id);
          return (
            <UserAvatar
              key={user.id}
              user={user}
              pressableStyle={{
                backgroundColor: isSelected ? "#a5aab053" : "transparent",
                borderRadius: isSelected ? 10 : 0,
                padding: 20,
                paddingLeft: 5,
                marginBottom: 5,
              }}
              onPress={(user) =>
                selected.length > 0
                  ? toggleSelect(user?.id)
                  : router.push({
                      pathname: "/user/detail",
                      params: {
                        userInfo: JSON.stringify(user),
                      },
                    })
              }
              onLongPress={(user) => toggleSelect(user?.id)}
            />
          );
        })}
        {isGettingUsers ||
          (isGettingMoreUsers && (
            <MyCustomText style={styles.membersListStatusMessage}>
              Cargando integrantes...
            </MyCustomText>
          ))}
        {users.length === 0 && (
          <MyCustomText style={styles.membersListStatusMessage}>
            Sin integrantes
          </MyCustomText>
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
      {/*Clear selected items button*/}
      {selected.length > 0 && (
        <Pressable onPress={clearSelected} style={styles.clearSelectedButton}>
          <Ionicons name="close-outline" size={27} color="white" />
        </Pressable>
      )}
      {/*Remove selected items from group*/}
      <BulkDeleteUsersFromGroupButton
        selected={selected}
        clearSelected={clearSelected}
        group={group}
      />
    </>
  );
}

const groupInfoStyles = (theme: AppTheme) => {
  return {
    scrollView: {
      padding: 20,
      paddingBottom: 100,
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
    clearSelectedButton: {
      width: 40,
      height: 40,
      position: "absolute",
      bottom: 80,
      left: "30%",
      borderRadius: "100%",
      backgroundColor: "gray",
      alignItems: "center",
      justifyContent: "center",
    },
    membersListStatusMessage:{
      textAlign: "center",
      marginTop: 15,
      fontSize:theme.fontSizes.md
    }
  };
};
