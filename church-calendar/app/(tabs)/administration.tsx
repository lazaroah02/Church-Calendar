import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

const UsersRoute = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Lista de usuarios</Text>
    </View>
  );
};

const GroupsRoute = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Lista de grupos</Text>
    </View>
  );
};

export default function Administration() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "users", title: "Usuarios" },
    { key: "groups", title: "Grupos" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "users":
        return <UsersRoute />;
      case "groups":
        return <GroupsRoute />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader
        title="Administración"
        rightComponent={
          <SimpleThreeDotsMenu
            modalStyles={{ right: 30, top: 70 }}
            childrenComponentFunction={(closeParent) => null}
          />
        }
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy={true}
        renderLazyPlaceholder={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Cargando...</Text>
          </View>
        )}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: "#fff",
              elevation: 0,
            }}
            indicatorStyle={{
              backgroundColor: "#444",
              height: 3,
              borderRadius: 2,
            }}
            activeColor="#000"
            inactiveColor="#777"
            labelStyle={{
              fontSize: 18,
              textTransform: "none",
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
