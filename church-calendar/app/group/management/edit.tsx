import { GroupManagementForm } from "@/components/administration/group/GroupManagementForm";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { PageHeader } from "@/components/PageHeader";
import { useSession } from "@/hooks/auth/useSession";
import { Group } from "@/types/group";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditGroup() {
  const { session } = useSession();
  const isAdmin = session?.userInfo.is_staff;
  const searchParams = useSearchParams();
  const groupInfoParam = searchParams.get("groupInfo") as string | undefined;
  const parsedGroupInfo: Group | null = groupInfoParam
    ? JSON.parse(groupInfoParam)
    : null;

  const navigation = useNavigation();

  useEffect(() => {
    if (!parsedGroupInfo) {
      router.replace("/+not-found");
      return;
    }
    if (!isAdmin) {
      router.replace("/+not-found");
      return;
    }
  }, [parsedGroupInfo, isAdmin]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type === "GO_BACK") {
          e.preventDefault();

          router.replace({
            pathname: "/group/management/detail",
            params: {
              groupInfo: JSON.stringify(parsedGroupInfo),
            },
          });
        }
      });

      return unsubscribe;
    }, [navigation, parsedGroupInfo])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar barStyle={"dark-content"} />
      <PageHeader
        title="Editar Grupo"
        onBack={() =>
          router.replace({
            pathname: "/group/management/detail",
            params: {
              groupInfo: JSON.stringify(parsedGroupInfo),
            },
          })
        }
      />
      <GroupManagementForm
        group={parsedGroupInfo}
        action="update"
        onCancel={() =>
          router.replace({
            pathname: "/group/management/detail",
            params: {
              groupInfo: JSON.stringify(parsedGroupInfo),
            },
          })
        }
      />
    </SafeAreaView>
  );
}
