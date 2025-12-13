import { PageHeader } from "@/components/PageHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useAdministrationTabs } from "@/hooks/administration/useAdministrationTabs";
import { MyCustomText } from "@/components/MyCustomText";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export default function Administration() {
  const { index, routes, renderScene, setIndex, layout } =
    useAdministrationTabs();

  const styles = useThemeStyles(AdministrationPageStyles);
  const { width, height, scale, fontScale } = useWindowDimensions();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <PageHeader title="Administración" />
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
            <MyCustomText style={styles.text}>Cargando...</MyCustomText>
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
            renderTabBarItem={({ route, onPress, onLongPress }) => (
              <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 12,
                  width: width / 2,
                }}
              >
                <MyCustomText style={styles.labelStyle}>
                  {route.title}
                </MyCustomText>
              </Pressable>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}

const AdministrationPageStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.md,
  },
  labelStyle: {
    fontSize: theme.fontSizes.md,
    fontFamily: "InterVariable",
    textTransform: "none",
    textAlign: "center",
  },
  labelActive: {
    fontWeight: "600",
  },
});
