import { View, Pressable, FlatList } from "react-native";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { router } from "expo-router";
import { UserAvatar } from "@/components/event/user-avatar";
import { Search } from "../Search";
import { Filters } from "../Filters";

export const UsersTab = () => {
  const { users } = useManageUsers();

  return (
    <View style={{ flex: 1, padding: 20, paddingBottom: 0 }}>
      <View style={styles.searchContainer}>
        <Search containerStyle={{ width: "85%" }} />
        <Filters />
      </View>
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
        ListFooterComponent={<View></View>}
        onEndReached={() => console.log("end reached")}
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
