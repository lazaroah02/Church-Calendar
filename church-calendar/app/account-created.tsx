import { Button } from "@/components/Button";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountCreated() {
  const styles = useThemeStyles(AccountCreatedStyles);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Su cuenta ha sido creada exitosamente!</Text>
        <Button
          text="Iniciar Sesión"
          disabled={false}
          variant="submit"
          onPress={() => router.replace("/sign-in")}
          style={{ width: 250 }}
        />
      </View>
    </SafeAreaView>
  );
}

const AccountCreatedStyles = (theme: AppTheme) => ({
  container: {
    width: "95%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
    justifyContent: "center",
    padding: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "LexendBold",
  },
});
