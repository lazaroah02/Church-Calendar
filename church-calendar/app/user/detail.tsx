import { Button } from "@/components/Button";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { UserForm } from "@/components/user/user-profile-form";
import { UserInfoComponent } from "@/components/user/user-info";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
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
  const [isEditting, setIsEdditing] = useState(false);
  if (!parsedUserInfo) {
    return router.replace("/+not-found");
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar barStyle={"dark-content"} />
      {isEditting ? (
        <UserForm
          user={parsedUserInfo}
          onCancel={() => setIsEdditing(false)}
          onSuccess={() => {
            return router.replace("/user/profile")
          }}
        />
      ) : (
        <UserInfoComponent user={parsedUserInfo} />
      )}

      {/* {session?.userInfo.id === parsedUserInfo.id && !isEditting && (
        <Button text="Editar Perfil" onPress={() => setIsEdditing(true)} />
      )} */}
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
