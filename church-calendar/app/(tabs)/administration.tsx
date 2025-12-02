import { PageHeader } from "@/components/PageHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useAdministrationTabs } from "@/hooks/administration/useAdministrationTabs";

export default function Administration() {
  const { index, routes, renderScene, setIndex, layout } =
    useAdministrationTabs();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <PageHeader
        title="Administración"
      />
      <TabView
        style={{ flex: 1 }}
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
