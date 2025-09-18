import { Text, View, Pressable } from "react-native";
import { Event } from "@/types/event";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";
import { router } from "expo-router";
import type { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export function EventComponent({
  item,
  currentDateReadable,
}: {
  item: Event;
  currentDateReadable: string;
}) {
  const styles = useThemeStyles(eventComponentStyles);
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/event/details",
          params: {
            event: JSON.stringify(item),
            currentDateReadable: currentDateReadable,
          },
        })
      }
      style={styles.eventCard}
    >
      <View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>
          {formatTimeRange(item.start_time, item.end_time)}
        </Text>
        <View style={styles.groups}>
          {item.groups_full_info?.map((group, i) => (
            <View key={i} style={styles.group}>
              <View
                style={[
                  styles.groupColor,
                  {
                    backgroundColor: group.color !== "" ? group.color : "#eee",
                  },
                ]}
              ></View>
              <Text style={styles.groupName}>{group.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const eventComponentStyles = (theme: AppTheme) => ({
  eventCard: {
    marginBottom: 25,
  },
  eventTime: {
    fontSize: theme.fontSizes.md,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: 900,
    opacity: 0.5,
  },
  eventTitle: {
    color: "#000",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
  },
  groups: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  group: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    paddingLeft: 0,
    borderRadius: 10,
    marginRight: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  groupColor: {
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  groupName: {
    color: "#000",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,
    opacity: 0.5,
  },
});
