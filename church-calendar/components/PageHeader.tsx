import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  Falsy,
  ViewStyle,
  RegisteredStyle,
  RecursiveArray,
} from "react-native";

export function PageHeader({
  title = "",
  rightComponent,
  onBack = () => router.back(),
  style = {},
}: {
  title?: string;
  rightComponent?: React.ReactNode;
  onBack?: () => void;
  style?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
}) {
  const styles = useThemeStyles(pageHeaderStyles);
  return (
    <View style={[styles.titleContainer, style]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons
          name="chevron-back"
          size={30}
          color="#000"
          style={{ marginLeft: -8, marginTop: 3 }}
          onPress={onBack}
        />
        <Text
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode="tail"
          lineBreakMode="tail"
        >
          {title}
        </Text>
      </View>
      {rightComponent}
    </View>
  );
}

const pageHeaderStyles = (theme: AppTheme) => ({
  titleContainer: {
    marginBottom: 10,
    marginTop:10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    width: "80%",
    fontSize: 23,
    fontWeight: "500",
    color: "#000",
    fontFamily: "LexendBold",
  },
});
