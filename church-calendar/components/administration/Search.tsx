import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export function Search({containerStyle}: {containerStyle?: any}) {
  const styles = useThemeStyles(SearchStyles);

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search-outline" size={22} color="black" />
      <TextInput placeholder="Buscar:" style={styles.input} />
    </View>
  );
}

const SearchStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: "rgba(211, 211, 211, 1)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  input: {
    fontSize: theme.fontSizes.md,
    backgroundColor: "rgba(211, 211, 211, 1)",
    width: "100%",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
});
