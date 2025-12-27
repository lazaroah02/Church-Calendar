import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Menu, Text } from "react-native-paper";
import { MyCustomText } from "./MyCustomText";

type MenuItemNoScaleProps = {
  title: string;
  leadingIcon?: string;
  onPress: () => void;
  disabled?: boolean;
  trailingIcon?: string;
};

export function MenuItemNoScale({
  title,
  leadingIcon,
  trailingIcon,
  onPress,
  disabled,
}: MenuItemNoScaleProps) {
  const styles = useThemeStyles(MenuItemNoScaleStyles);
  return (
    <Menu.Item
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      disabled={disabled}
      onPress={onPress}
      titleMaxFontSizeMultiplier={1}
      containerStyle={styles.content}
      title={
        <MyCustomText style={styles.title} allowFontScaling={false}>
          {title}
        </MyCustomText>
      }
    />
  );
}

const MenuItemNoScaleStyles = (theme: AppTheme) => ({
    content: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSizes.md,
  },
});
