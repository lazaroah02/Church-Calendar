import { Button } from "@/components/Button";
import { UserProfileForm } from "@/components/user/user-profile-form";
import { UserInfoComponent } from "@/components/user/user-info";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { Ionicons } from "@expo/vector-icons";
import { MyCustomText } from "@/components/MyCustomText";

export default function UserProfile() {
  const styles = useThemeStyles(userProfileStyles);
  const { session } = useSession();

  const [isEditting, setIsEdditing] = useState(false);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <PageHeader
        title={"Perfil de Usuario"}
        rightComponent={
          !isEditting && (
            <SimpleThreeDotsMenu
              childrenComponentFunction={(closeParent) => (
                <>
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => {
                      closeParent();
                      router.push({ pathname: "/user/change-password" });
                    }}
                  >
                    <Ionicons name="key-outline" size={20} />
                    <MyCustomText style={styles.text}>Cambiar Contraseña</MyCustomText>
                  </TouchableOpacity>
                </>
              )}
            />
          )
        }
      />
      {isEditting ? (
        <UserProfileForm
          user={session?.userInfo}
          onCancel={() => setIsEdditing(false)}
          onSuccess={() => {
            return router.replace("/user/profile");
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
    touchable: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      padding: 10,
    },
    text: {
      fontSize: theme.fontSizes.lg,
    },
  };
};
