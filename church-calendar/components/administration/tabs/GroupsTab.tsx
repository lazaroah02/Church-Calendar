import { useManageGroups } from "@/hooks/groups/useManageGroups";
import { View, FlatList } from "react-native";
import { GroupAvatar } from "../group/GroupAvatar";
import { router } from "expo-router";
import { Search } from "../Search";
import { CustomMenu } from "@/components/CustomMenu";
import { useGroupAdministrationFilters } from "@/hooks/administration/useGroupAdministrationFilters";
import { MyCustomText } from "@/components/MyCustomText";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MenuItemNoScale } from "@/components/MenuItemNoScale";

export const GroupsTab = () => {
  const { groups, loadingGroups, errorGettingGroups, refetchGroups } =
    useManageGroups();

  const { filteredGroups, handleSearch } = useGroupAdministrationFilters({
    groups: groups,
  });

  const styles = useThemeStyles(GroupsTabStyles)

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 30,
          marginBottom: 10,
        }}
      >
        <Search
          initialSearchValue=""
          onSearch={(searchValue) => handleSearch(searchValue)}
          containerStyle={{ width: "85%" }}
        />
        <CustomMenu
          renderItems={(closeParent) => (
            <MenuItemNoScale
              title="Crear Grupo"
              leadingIcon="plus"
              onPress={() => {
                router.push("/group/management/create");
                closeParent();
              }}
            />
          )}
        />
      </View>
      <FlatList
        data={filteredGroups}
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
        ListFooterComponent={
          <View style={{ padding: 20, justifyContent: "center" }}>
            {!loadingGroups && errorGettingGroups && (
              <MyCustomText style={[styles.text, { textAlign: "center" }]}>
                Error al obtener los grupos. Revisa tu conexión a internet.
              </MyCustomText>
            )}
          </View>
        }
      />
    </View>
  );
};

const GroupsTabStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.md,
  },
});
