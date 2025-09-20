import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { router } from "expo-router";
import { Pressable, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const styles = useThemeStyles(notFoundStyles);
  return (
    <SafeAreaView style={styles.container}>
      <MyNavigationBar buttonsStyle="dark" />
      <Text style={styles.notFoundMessage}>No Encontrado</Text>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Volver</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const notFoundStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  notFoundMessage: {
    fontSize: theme.fontSizes.lg,
    color: "#000",
    fontFamily: "InterVariable",
  },
  backButton: {
    width: 100,
    height: 55,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 100,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    color: "#442525",
    fontSize: theme.fontSizes.xl,
    fontWeight: "900",
    fontFamily: "InterVariable",
  },
});
