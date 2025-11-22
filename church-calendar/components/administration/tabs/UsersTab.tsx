import { View, FlatList, Text } from "react-native";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { UserAvatar } from "@/components/event/user-avatar";
import { Search } from "../Search";
import { UserFilters, UserFiltersBottomSheet } from "../UserFilters";
import { useMemo, useState } from "react";
import { debounce } from "@/lib/debounce";
import { Button } from "@/components/Button";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const UsersTab = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    is_staff: "",
    is_active: "",
    member_groups: [],
  });

  const {
    users,
    fetchNextPageOfUsers,
    isGettingMoreUsers,
    hasMoreUsers,
    refetchUsers,
    isGettingUsers,
  } = useManageUsers({ searchTerm: search, filters: filters });

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 500),
    []
  );

  const { userFiltersBottomSheet, openUserFiltersBottomSheetButton } =
    UserFiltersBottomSheet({
      handleFilterChange: setFilters,
      defaultFilters: filters,
    });

  return (
    <View style={{ flex: 1, padding: 20, paddingBottom: 0 }}>
      <View style={styles.searchContainer}>
        <Search
          containerStyle={{ width: "85%" }}
          initialSearchValue={search}
          onSearch={(searchValue: string) => debouncedSearch(searchValue)}
        />
        {openUserFiltersBottomSheetButton()}
      </View>
      <FlatList
        data={users}
        onRefresh={refetchUsers}
        refreshing={isGettingUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserAvatar user={item} title="" />}
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
      {userFiltersBottomSheet()}
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
