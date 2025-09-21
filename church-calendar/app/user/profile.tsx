import { BASE_URL } from "@/api-endpoints";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { ScrollView, Text, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfile() {
  const styles = useThemeStyles(userProfileStyles);
  const { session } = useSession();

  const searchParams = useSearchParams();
    const userInfoParam = searchParams.get("userInfo") as string | undefined;
    const parsedUserInfo: UserInfo | null = userInfoParam ? JSON.parse(userInfoParam) : null;

  if (!parsedUserInfo) {
    return router.replace("/+not-found");
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/*Profile Picture*/}
        <View style={styles.profilePictureContainer}>
          {parsedUserInfo.profile_img ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: `${BASE_URL}${parsedUserInfo.profile_img}` }}
            />
          ) : (
            <Ionicons name="person-outline" size={100} color="#fff" />
          )}
        </View>

        {/*Full Name*/}
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{parsedUserInfo.full_name}</Text>
          <Ionicons name="checkmark-circle" size={20} color="fff" />
        </View>

        {/*Description*/}
        <Text style={styles.description}>{parsedUserInfo.description}</Text>
        
        {/* Groups */}
        <Text style={styles.groupLabel}>Grupos:</Text>
        <View style={styles.groupsContainer}>
          {parsedUserInfo.member_groups_full_info?.map((group) => (
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
    </SafeAreaView>
  );
}

const userProfileStyles = (theme: AppTheme) => {
  return {
    pageContainer: {
      flex: 1,
      backgroundColor: "#fff",
    },
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
      fontWeight: 700,
      fontSize: theme.fontSizes.lg,
    },
    description: {
      fontSize: theme.fontSizes.md,
      marginTop: 20,
    },
    groupLabel: {
      fontWeight: "900",
      marginBottom: 5,
      marginTop:20,
      color: "#000",
      fontFamily: "InterVariable",
      fontSize: theme.fontSizes.lg,
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
      fontWeight: "400",
    },
    groupColor: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
  };
};
