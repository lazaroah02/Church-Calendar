import { GroupManagementForm } from "@/components/administration/group/GroupManagementForm";
import { PageHeader } from "@/components/PageHeader";
import { useSession } from "@/hooks/auth/useSession";
import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGroup() {
  const { session } = useSession();
  const isAdmin = session?.userInfo.is_staff;

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/+not-found");
      return;
    }
  }, [isAdmin]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader title="Crear Grupo" onBack={() => router.back()} />
      <GroupManagementForm onCancel={() => router.back()} action="create"/>
    </SafeAreaView>
  );
}
