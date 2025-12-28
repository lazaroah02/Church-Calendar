import { View, Pressable } from "react-native";
import { EventTemplate } from "@/types/event";
import {
  formatTimeRange,
} from "@/lib/calendar/calendar-utils";
import type { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyCustomText } from "../MyCustomText";

export function TemplateComponent({
  item,
  onPress = () => null,
}: {
  item: EventTemplate;
  onPress: () => void;
}) {
  const styles = useThemeStyles(eventComponentStyles);
  return (
    <Pressable onPress={onPress} style={styles.eventCard}>
      <View>
        <MyCustomText
          style={[
            styles.eventTitle
          ]}
        >
          {item.title}
        </MyCustomText>
        <MyCustomText style={styles.eventTime}>
          {formatTimeRange(item.start_time, item.end_time)}
        </MyCustomText>
      </View>
    </Pressable>
  );
}

const eventComponentStyles = (theme: AppTheme) => ({
  eventCard: {
    marginBottom: 25,
  },
  eventTime: {
    fontSize: theme.fontSizes.sm,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: 700,
    opacity: 0.5,
  },
  eventTitle: {
    color: "#000000c6",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
});
