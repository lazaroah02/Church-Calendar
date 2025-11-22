import { useManageGroups } from "@/hooks/groups/useManageGroups";
import { View, FlatList } from "react-native";
import { GroupAvatar } from "../group/GroupAvatar";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";

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
            <GroupAvatar
              group={item}
              onPress={() =>
                router.push({
                  pathname: "/group/management/detail",
                  params: {
                    groupInfo: JSON.stringify(item),
                  },
                })
              }
            />
          </View>
        )}
      />
      <Button
        variant="submit"
        onPress={() => router.push("/group/management/create")}
        text=""
        style={{
          width: 50,
          height: 50,
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Button>
    </View>
  );
};
