import { MyCustomText } from "@/components/MyCustomText";
import { useMyNavigationBar } from "@/hooks/useMyNavigationBar";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { router } from "expo-router";
import { Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const styles = useThemeStyles(notFoundStyles);
  useMyNavigationBar({backgroundColor: "#EAEAEA", buttonsStyle: "dark"});
  return (
    <SafeAreaView style={styles.container}>
      <MyCustomText style={styles.notFoundMessage}>No Encontrado</MyCustomText>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <MyCustomText style={styles.backButtonText}>Volver</MyCustomText>
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
    backgroundColor:"#EAEAEA"
  },
  notFoundMessage: {
    fontSize: theme.fontSizes.md,
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
