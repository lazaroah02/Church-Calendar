import { useManageGroups } from "@/hooks/groups/useManageGroups";
import { View, FlatList } from "react-native";
import { GroupAvatar } from "../group/GroupAvatar";

export const GroupsTab = () => {
  const { groups, loadingGroups, errorGettingGroups, refetchGroups } =
    useManageGroups();
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={groups}
        onRefresh={refetchGroups}
        refreshing={loadingGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 15 }}>
            <GroupAvatar group={item} />
          </View>
        )}
      />
    </View>
  );
};
