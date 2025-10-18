import { PageHeader } from "@/components/PageHeader";
import { UserManagementForm } from "@/components/user/user-management-form";
import { UserInfo } from "@/types/auth";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditUser() {
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
  }, [parsedUserInfo]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader
        title="Editar Usuario"
        onBack={() =>
          router.replace({
            pathname: "/user/detail",
            params: {
              userInfo: JSON.stringify(parsedUserInfo),
            },
          })
        }
      />
      <UserManagementForm
        user={parsedUserInfo}
        onCancel={() =>
          router.replace({
            pathname: "/user/detail",
            params: {
              userInfo: JSON.stringify(parsedUserInfo),
            },
          })
        }
      />
    </SafeAreaView>
  );
}
