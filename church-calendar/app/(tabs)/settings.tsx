import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/auth/useSession";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { Collapsible } from "@/components/Collapsible";
import { useAppTheme } from "@/contexts/theme-context";
import { Button } from "@/components/Button";
import { CheckBox } from "@/components/form/checkbox";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useVersionsUpdates } from "@/hooks/useVersionUpdates";
import { openBrowserAsync } from "expo-web-browser";
import { MyCustomText } from "@/components/MyCustomText";
import { usePlatform } from "@/hooks/usePlatform";

export default function Settings() {
  const { signOut } = useSession();
  const styles = useThemeStyles(settingsStyles);
  const { themeName, setThemeName } = useAppTheme();
  const {isWeb} = usePlatform()
  
  const {
    checkForUpdate,
    checkingForUpdates,
    confirmUpdate,
    lastCheck,
    updateInfo,
  } = useVersionsUpdates();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <MyCustomText style={styles.title}>Opciones</MyCustomText>

        {/*Font Size*/}
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

        {/*About the app*/}
        {!isWeb && (
          <Collapsible
            title="Acerca de la Aplicación"
            style={styles.optionCollapsible}
          >
            <View>
              <MyCustomText style={styles.text}>
                Versión Actual: {Constants.expoConfig?.version}
              </MyCustomText>
              {lastCheck && (
                <View style={{ marginTop: 10 }}>
                  <MyCustomText style={styles.text}>
                    Ultima comprobación:
                  </MyCustomText>
                  <MyCustomText style={styles.text}>
                    {lastCheck.toLocaleDateString()}{" "}
                    {lastCheck.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </MyCustomText>
                </View>
              )}
              <TouchableOpacity
                style={styles.checkUpdatesButton}
                onPress={checkForUpdate}
              >
                <Ionicons name="download-outline" size={22} />
                <MyCustomText style={styles.text}>
                  {checkingForUpdates
                    ? "Buscando Actualizaciones ..."
                    : "Buscar Actualizaciones"}
                </MyCustomText>
              </TouchableOpacity>
              {confirmUpdate({
                title: "Nueva versión encontrada!",
                message: `Una nueva versión de la aplicación (v${updateInfo.version}) está disponible. ¿Deseas descargarla?`,
              })}
            </View>
          </Collapsible>
        )}

        {/*Support*/}
        <Collapsible
          title="Soporte y Contacto"
          style={styles.optionCollapsible}
        >
          <View>
            <MyCustomText style={styles.text}>
              Tienes alguna duda o has detectado algún error en la aplicación?
            </MyCustomText>
            <TouchableOpacity
              style={styles.checkUpdatesButton}
              onPress={async () => {
                await openBrowserAsync("https://wa.me/+51706583");
              }}
            >
              <Ionicons name="logo-whatsapp" size={22} />
              <MyCustomText style={styles.text}>
                Contactar con Soporte
              </MyCustomText>
            </TouchableOpacity>
          </View>
        </Collapsible>
        <View style={{ height: 100 }}></View>
      </ScrollView>

      {/*Close Session Button*/}
      <Button
        style={{ width: 250, marginBottom: 20, borderRadius: 20 }}
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
                },
                style: "default",
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="log-out-outline" size={24} />
          <MyCustomText style={styles.closeSessionButtonText}>
            Cerrar Sesión
          </MyCustomText>
        </View>
      </Button>
    </SafeAreaView>
  );
}

const settingsStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight:10
  },
  title: {
    width: 200,
    textAlign: "start",
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: 26,
    fontWeight: "700",
  },
  optionCollapsible: {
    marginTop: 20,
    marginLeft: -3,
  },
  closeSessionButtonText: {
    color: "#000",
    fontSize: theme.fontSizes.md,
    fontWeight: "900",
    fontFamily: "InterVariable",
  },
  text: {
    fontSize: theme.fontSizes.md,
    fontFamily: "InterVariable",
    marginTop: 3,
  },
  checkUpdatesButton: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    alignSelf: "flex-start",
  },
});
