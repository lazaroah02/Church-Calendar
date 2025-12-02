import { GroupInfoComponent } from "@/components/administration/group/GroupInfoComponent";
import { GroupThreeDotsMenuOptions } from "@/components/administration/group/GroupThreeDotsOptions";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { useSession } from "@/hooks/auth/useSession";
import { Group } from "@/types/group";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupDetail() {
  const { session } = useSession();

  const isAdmin = session?.userInfo.is_staff;

  const searchParams = useSearchParams();
  const groupInfoParam = searchParams.get("groupInfo") as string | undefined;
  const parsedGroupInfo: Group | null = groupInfoParam
    ? JSON.parse(groupInfoParam)
    : null;

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader
        title="Detalles del Grupo"
        rightComponent={
          <SimpleThreeDotsMenu
            childrenComponentFunction={(closeParent) => (
              <GroupThreeDotsMenuOptions
                group={parsedGroupInfo}
                closeParent={closeParent}
              />
            )}
          />
        }
      />
      <GroupInfoComponent group={parsedGroupInfo} />
    </SafeAreaView>
  );
}
