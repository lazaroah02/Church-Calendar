import { View, Pressable } from "react-native";
import { Event } from "@/types/event";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";
import { router } from "expo-router";
import type { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyCustomText } from "../MyCustomText";

export function EventComponent({
  item,
}: {
  item: Event;
}) {
  const styles = useThemeStyles(eventComponentStyles);
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/event/details",
          params: {
            event: JSON.stringify(item),
          },
        })
      }
      style={styles.eventCard}
    >
      <View>
        <MyCustomText
          style={[
            styles.eventTitle,
            item.is_canceled ? { textDecorationLine: "line-through" } : {},
          ]}
        >
          {item.title}
        </MyCustomText>
        {(item.is_canceled ?? item.visible === false) && (
          <View style={{ flexDirection: "row", gap: 6, marginVertical: 4 }}>
            {item.is_canceled && (
              <MyCustomText
              style={[
                styles.eventTime,
                {
                  alignSelf: "flex-start",
                  backgroundColor: "orange",
                  padding: 4,
                  borderRadius: 10,
                  opacity:1
                },
              ]}
            >
              Cancelado
            </MyCustomText>
            )}
            {item.visible === false && (
              <MyCustomText
              style={[
                styles.eventTime,
                {
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(178, 167, 10, 1)",
                  padding: 4,
                  borderRadius: 10,
                  opacity:1
                },
              ]}
            >
              Oculto
            </MyCustomText>
            )}
            
          </View>
        )}
        <MyCustomText style={styles.eventTime}>
          {formatTimeRange(item.start_time, item.end_time)}
        </MyCustomText>
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
              <MyCustomText style={styles.groupName}>{group.name}</MyCustomText>
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
