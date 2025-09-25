import { Button } from "@/components/Button";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { UserProfileForm } from "@/components/user/user-profile-form";
import { UserInfoComponent } from "@/components/user/user-info";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfile() {
  const styles = useThemeStyles(userProfileStyles);
  const { session } = useSession();

  const [isEditting, setIsEdditing] = useState(false);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar barStyle={"dark-content"} />
      {isEditting ? (
        <UserProfileForm
          user={session?.userInfo}
          onCancel={() => setIsEdditing(false)}
          onSuccess={() => {
            return router.replace("/user/profile")
          }}
        />
      ) : (
        <UserInfoComponent user={session?.userInfo} />
      )}

      {session?.userInfo.id === session?.userInfo.id && !isEditting && (
        <Button text="Editar Perfil" onPress={() => setIsEdditing(true)} />
      )}
    </SafeAreaView>
  );
}

const userProfileStyles = (theme: AppTheme) => {
  return {
    pageContainer: {
      flex: 1,
      backgroundColor: "#fff",
    },
  };
};
