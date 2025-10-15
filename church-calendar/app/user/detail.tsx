import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { UserInfoComponent } from "@/components/user/user-info";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserDetail() {
  const styles = useThemeStyles(userDetailStyles);
  const { session } = useSession();

  const searchParams = useSearchParams();
  const userInfoParam = searchParams.get("userInfo") as string | undefined;
  const parsedUserInfo: UserInfo | null = userInfoParam
    ? JSON.parse(userInfoParam)
    : null;

  useEffect(() => {
    if (!parsedUserInfo) {
      router.replace("/+not-found");
      return;
    }

    if (parsedUserInfo.id === session?.userInfo.id) {
      router.replace("/user/profile");
    }
  }, [parsedUserInfo, session]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar barStyle={"dark-content"} />
      <PageHeader
        title="Detalles de Usuario"
        rightComponent={
          <SimpleThreeDotsMenu
            childrenComponentFunction={(closeParent) => null}
          />
        }
      />
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
