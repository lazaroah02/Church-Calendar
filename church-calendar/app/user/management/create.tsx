import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { PageHeader } from "@/components/PageHeader";
import { UserManagementForm } from "@/components/user/user-management-form";
import { router } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/auth/useSession";

export default function CreateUser() {
  const { session } = useSession();
  const isAdmin = session?.userInfo.is_staff || false;

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/+not-found");
      return;
    }
  }, [isAdmin]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar style="dark" />
      <PageHeader title="Crear Usuario" onBack={() => router.back()} />
      <UserManagementForm action="create" onCancel={() => router.back()} />
    </SafeAreaView>
  );
}
