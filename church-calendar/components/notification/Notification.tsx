import { StoredNotification } from "@/hooks/notifications/useNotificationHistory";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { MyCustomText } from "../MyCustomText";

export function Notification({
  removeNotification,
  notif,
}: {
  removeNotification: (id: string) => void;
  notif: StoredNotification;
}) {
  const styles = useThemeStyles(NotificationStyles);
  return (
    <View
      key={notif.id}
      style={{
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <TouchableOpacity
        style={{ width: "85%" }}
        onPress={() => {
          if (notif.data?.pathname)
            router.push({
              pathname: notif.data.pathname,
              params: {
                selectedDayParam: JSON.stringify(
                  notif.data.params?.selectedDayParam
                ),
              },
            });
        }}
      >
        <MyCustomText style={styles.title}>{notif.title || "No Title"}</MyCustomText>
        <MyCustomText style={styles.content}>{notif.body || "No Body"}</MyCustomText>
        <MyCustomText style={styles.receivetAt}>
          Recibido el:{" "}
          {new Date(notif.receivedAt).toLocaleString("es-ES", {
            hour12: true,
          })}
        </MyCustomText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeNotification(notif.id)}>
        <Ionicons name="trash-outline" color={"rgba(0, 0, 0, 1)"} size={22} />
      </TouchableOpacity>
    </View>
  );
}

const NotificationStyles = (theme: AppTheme) => ({
  title: {
    color: "#000",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
  },
  content: {
    fontSize: theme.fontSizes.md,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: 900,
    opacity: 0.8,
    marginTop: 3,
  },
  receivetAt: {
    color: "#000",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,
    opacity: 0.6,
    marginTop: 5,
  },
});
