import { View, FlatList, Text, Pressable } from "react-native";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { UserAvatar } from "@/components/event/user-avatar";
import { Search } from "../Search";
import { UserFiltersBottomSheet } from "../UserFilters";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserAdministrationFilters } from "@/hooks/administration/useUserAdministrationFilters";
import { useSelectedItems } from "@/hooks/administration/useSelectedItems";
import { CustomMenu } from "@/components/CustomMenu";
import { UserOptions } from "../user/UserOptions";

export const UsersTab = () => {
  const { search, setFilters, filters, debouncedSearch } =
    useUserAdministrationFilters();

  const {
    users,
    fetchNextPageOfUsers,
    isGettingMoreUsers,
    hasMoreUsers,
    refetchUsers,
    isGettingUsers,
  } = useManageUsers({ searchTerm: search, filters: filters });

  const { userFiltersBottomSheet, openUserFiltersBottomSheetButton } =
    UserFiltersBottomSheet({
      handleFilterChange: setFilters,
      defaultFilters: filters,
    });

  const { selected, toggleSelect, clearSelected } = useSelectedItems<
    number | undefined
  >();

  return (
    <View style={{ flex: 1, padding: 20, paddingBottom: 0 }}>
      <View style={styles.searchContainer}>
        <Search
          containerStyle={{ flex: 1 }}
          initialSearchValue={search}
          onSearch={(searchValue: string) => debouncedSearch(searchValue)}
        />
        {openUserFiltersBottomSheetButton()}

        <CustomMenu
          renderItems={(closeParent) => (
            <UserOptions closeParent={closeParent} selected={selected} clearSelected={clearSelected}/>
          )}
        />
      </View>
      <FlatList
        data={users}
        onRefresh={refetchUsers}
        refreshing={isGettingUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <UserAvatar
              user={item}
              pressableStyle={{
                backgroundColor: isSelected ? "#a5aab053" : "transparent",
                borderRadius: isSelected ? 10 : 0,
                padding: 20,
                paddingLeft: 5,
                marginBottom: 5,
              }}
              onPress={(user) =>
                selected.length > 0
                  ? toggleSelect(user?.id)
                  : router.push({
                      pathname: "/user/detail",
                      params: {
                        userInfo: JSON.stringify(user),
                      },
                    })
              }
              onLongPress={(user) => toggleSelect(user?.id)}
            />
          );
        }}
        ListFooterComponent={
          <View style={{ padding: 20, justifyContent: "center" }}>
            {isGettingMoreUsers && (
              <Text style={{ textAlign: "center" }}>
                Cargando mas usuarios...
              </Text>
            )}
            {!isGettingMoreUsers && !isGettingUsers && !hasMoreUsers && (
              <Text style={{ textAlign: "center" }}>No hay mas usuarios</Text>
            )}
          </View>
        }
        onEndReached={() =>
          !isGettingMoreUsers && hasMoreUsers && fetchNextPageOfUsers()
        }
      />
      {userFiltersBottomSheet()}

      {/*Clear selected items button*/}
      {selected.length > 0 && (
        <Pressable onPress={clearSelected} style={styles.clearSelectedButton}>
          <Ionicons name="close-outline" size={27} color="black" />
        </Pressable>
      )}
    </View>
  );
};

const styles = {
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    marginBottom: 10,
  },
  clearSelectedButton: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 30,
    left: "50%",
    borderRadius: "100%",
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
};
