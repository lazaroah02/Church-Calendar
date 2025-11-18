import { View, Pressable, FlatList, Text } from "react-native";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { router } from "expo-router";
import { UserAvatar } from "@/components/event/user-avatar";
import { Search } from "../Search";
import { Filters } from "../Filters";

export const UsersTab = () => {
  const {
    users,
    fetchNextPageOfUsers,
    isGettingMoreUsers,
    hasMoreUsers,
    refetchUsers,
    isGettingUsers,
  } = useManageUsers();

  return (
    <View style={{ flex: 1, padding: 20, paddingBottom: 0 }}>
      <View style={styles.searchContainer}>
        <Search containerStyle={{ width: "85%" }} />
        <Filters />
      </View>
      <FlatList
        data={users}
        onRefresh={refetchUsers}
        refreshing={isGettingUsers}
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
        ListFooterComponent={
          <View style={{ padding: 20, justifyContent:"center" }}>
            {isGettingMoreUsers && <Text style={{textAlign:"center"}}>Cargando mas usuarios...</Text>}
            {!isGettingMoreUsers && !hasMoreUsers && <Text style={{textAlign:"center"}}>No hay mas usuarios</Text>}
          </View>
        }
        onEndReached={() =>
          !isGettingMoreUsers && hasMoreUsers && fetchNextPageOfUsers()
        }
      />
    </View>
  );
};

const styles = {
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 10,
  },
};
