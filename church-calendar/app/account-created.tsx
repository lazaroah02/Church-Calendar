import { Button } from "@/components/Button";
import { MyCustomText } from "@/components/MyCustomText";
import { useMyNavigationBar } from "@/hooks/useMyNavigationBar";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountCreated() {
  const styles = useThemeStyles(AccountCreatedStyles);
  useMyNavigationBar({backgroundColor:"#EAEAEA", buttonsStyle:"dark"})
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"#EAEAEA" }}>
      <View style={styles.container}>
        <MyCustomText style={styles.title}>Su cuenta ha sido creada exitosamente!</MyCustomText>
        <Button
          text="Iniciar Sesión"
          disabled={false}
          variant="submit"
          onPress={() => router.replace("/sign-in")}
          style={{ width: 250 }}
          textStyle = {{fontWeight:"900"}}
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
    fontSize: theme.fontSizes.lg,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "LexendBold",
  },
});
