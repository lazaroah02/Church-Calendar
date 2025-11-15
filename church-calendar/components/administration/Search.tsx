import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export function Search() {
  const styles = useThemeStyles(SearchStyles);

  return (
    <View>
        <TextInput placeholder="Buscar:" style={styles.input} />
    </View>
);
}

const SearchStyles = (theme: AppTheme) => ({
  input: {
    fontSize: theme.fontSizes.md,
    backgroundColor: "red"
  },
});
