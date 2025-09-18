import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/auth/useSession";
import { navigate } from "expo-router/build/global-state/routing";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { Collapsible } from "@/components/Collapsible";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/theme-context";

export default function Settings() {
  const { signOut } = useSession();
  const styles = useThemeStyles(settingsStyles);
  const { themeName, setThemeName } = useAppTheme();
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Opciones</Text>
        <Collapsible title="Tamaño de Letra" style={styles.optionCollapsible}>
          <Pressable
            style={styles.optionContainer}
            onPress={() => setThemeName("normal")}
          >
            <Text style={styles.optionText}>Normal</Text>
            {themeName === "normal" ? (
              <Ionicons name="checkbox-outline" size={20} color="#000" />
            ) : (
              <Ionicons name="square-outline" size={20} color="#000" />
            )}
          </Pressable>
          <Pressable
            style={styles.optionContainer}
            onPress={() => setThemeName("large")}
          >
            <Text style={styles.optionText}>Grande</Text>
            {themeName === "large" ? (
              <Ionicons name="checkbox-outline" size={20} color="#000" />
            ) : (
              <Ionicons name="square-outline" size={20} color="#000" />
            )}
          </Pressable>
        </Collapsible>
      </ScrollView>
      <Pressable
        style={styles.signOutButton}
        onPress={() => {
          Alert.alert(
            "Cuidado!",
            "Quieres cerrar sesión?",
            [
              {
                text: "Cancelar",
                style: "cancel",
              },
              {
                text: "Continuar",
                onPress: () => {
                  signOut();
                  navigate("/welcome");
                },
                style: "default",
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const settingsStyles = (theme: AppTheme) => ({
  container: {
    flexGrow: 1,
    height: "90%",
    paddingTop: 20,
    paddingLeft: 40,
  },
  title: {
    width: 200,
    textAlign: "start",
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: 25,
    fontWeight: "700",
  },
  signOutButton: {
    alignSelf: "center",
    width: 330,
    height: 55,
    backgroundColor: "#B5B5B5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  signOutButtonText: {
    color: "#000",
    fontSize: theme.fontSizes.md,
    fontWeight: "500",
    fontFamily: "InterVariable",
  },
  optionCollapsible: {
    marginTop: 20,
    marginLeft: -3,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  optionText: {
    fontSize: theme.fontSizes.md,
    fontFamily: "InterVariable",
    fontWeight: 600,
  },
});
