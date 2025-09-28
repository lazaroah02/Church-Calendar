import { Alert, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/auth/useSession";
import { navigate } from "expo-router/build/global-state/routing";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { Collapsible } from "@/components/Collapsible";
import { useAppTheme } from "@/contexts/theme-context";
import { Button } from "@/components/Button";
import { CheckBox } from "@/components/form/checkbox";

export default function Settings() {
  const { signOut } = useSession();
  const styles = useThemeStyles(settingsStyles);
  const { themeName, setThemeName } = useAppTheme();
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Opciones</Text>
        <Collapsible title="Tamaño de Letra" style={styles.optionCollapsible}>
          <CheckBox
            label="Normal"
            checked={themeName === "normal"}
            onCheck={() => setThemeName("normal")}
          />
          <CheckBox
            label="Grande"
            checked={themeName === "large"}
            onCheck={() => setThemeName("large")}
          />
        </Collapsible>
      </ScrollView>
      <Button
        text="Cerrar Sesión"
        variant="cancel"
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
      />
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
  optionCollapsible: {
    marginTop: 20,
    marginLeft: -3,
  },
});
