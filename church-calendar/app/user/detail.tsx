import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { UserInfoComponent } from "@/components/user/user-info";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserDetail() {
  const styles = useThemeStyles(userDetailStyles);

  const searchParams = useSearchParams();
  const userInfoParam = searchParams.get("userInfo") as string | undefined;
  const parsedUserInfo: UserInfo | null = userInfoParam
    ? JSON.parse(userInfoParam)
    : null;
  if (!parsedUserInfo) {
    return router.replace("/+not-found");
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar barStyle={"dark-content"} />
      <UserInfoComponent user={parsedUserInfo} />
    </SafeAreaView>
  );
}

const userDetailStyles = (theme: AppTheme) => {
  return {
    pageContainer: {
      flex: 1,
      backgroundColor: "#fff",
    },
  };
};
