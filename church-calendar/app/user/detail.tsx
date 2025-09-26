import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { UserInfoComponent } from "@/components/user/user-info";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserDetail() {
  const styles = useThemeStyles(userDetailStyles);
  const {session} = useSession()

  const searchParams = useSearchParams();
  const userInfoParam = searchParams.get("userInfo") as string | undefined;
  const parsedUserInfo: UserInfo | null = userInfoParam
    ? JSON.parse(userInfoParam)
    : null;
  
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!parsedUserInfo) {
      setRedirecting(true);
      router.replace("/+not-found");
      return;
    }

    if (parsedUserInfo.id === session?.userInfo.id) {
      setRedirecting(true);
      router.replace("/user/profile");
    }
  }, [parsedUserInfo, session]);

  if (redirecting) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
