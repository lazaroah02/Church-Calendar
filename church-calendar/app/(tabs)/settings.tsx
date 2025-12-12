import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/auth/useSession";
import { navigate } from "expo-router/build/global-state/routing";
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

export default function Settings() {
  const { signOut } = useSession();
  const styles = useThemeStyles(settingsStyles);
  const { themeName, setThemeName } = useAppTheme();
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
        <Text style={styles.title}>Opciones</Text>
        <Collapsible title="Tamaño de Letra" style={styles.optionCollapsible}>
          <CheckBox
            label="Normal"
            checked={themeName === "normal" || themeName == null}
            onCheck={() => setThemeName("normal")}
          />
          <CheckBox
            label="Grande"
            checked={themeName === "large"}
            onCheck={() => setThemeName("large")}
          />
        </Collapsible>
        <View>
          <Text
            style={[styles.title, { width: 300, marginTop: 50, fontSize: 24 }]}
          >
            Acerca de la Aplicación
          </Text>
          <Text style={styles.text}>
            Versión Actual: {Constants.expoConfig?.version}
          </Text>
          {lastCheck && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.text}>Ultima comprobación:</Text>
              <Text style={styles.text}>
                {lastCheck.toLocaleDateString()}{" "}
                {lastCheck.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.checkUpdatesButton}
            onPress={checkForUpdate}
          >
            <Ionicons name="download-outline" size={22} />
            <Text style={styles.text}>
              {checkingForUpdates
                ? "Buscando Actualizaciones ..."
                : "Buscar Actualizaciones"}
            </Text>
          </TouchableOpacity>
          {confirmUpdate({
            title: "Nueva versión encontrada!",
            message: `Una nueva versión de la aplicación (v${updateInfo.version}) está disponible. ¿Deseas descargarla?`,
          })}
        </View>
        <View>
          <Text
            style={[styles.title, { width: 300, marginTop: 50, fontSize: 24 }]}
          >
            Soporte y Contacto
          </Text>
          <Text style={styles.text}>
            Tienes alguna duda o has detectado algún error en la aplicación?
          </Text>
          <TouchableOpacity
            style={styles.checkUpdatesButton}
            onPress={async () => {
              await openBrowserAsync(
                "https://wa.me/+51706583"
              );
            }}
          >
            <Ionicons name="logo-whatsapp" size={22} />
            <Text style={styles.text}>Contactar con Soporte</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <Button
        style={{ marginBottom: -10 }}
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
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="log-out-outline" size={24} />
          <Text style={styles.closeSessionButtonText}>Cerrar Sesión</Text>
        </View>
      </Button>
    </SafeAreaView>
  );
}

const settingsStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
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
  closeSessionButtonText: {
    color: "#000",
    fontSize: theme.fontSizes.md,
    fontWeight: "500",
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
