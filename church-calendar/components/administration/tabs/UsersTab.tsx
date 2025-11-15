import { View, Pressable, FlatList } from "react-native";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { router } from "expo-router";
import { UserAvatar } from "@/components/event/user-avatar";

export const UsersTab = () => {
  const { users } = useManageUsers();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/user/detail",
                params: {
                  userInfo: JSON.stringify(item),
                },
              })
            }
          >
            <UserAvatar user={item} title="" />
          </Pressable>
        )}
      />
    </View>
  );
};
