import { Notification } from "@/components/notification/Notification";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { useNotifications } from "@/contexts/notifications-context";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const {notificationHistory, clearNotifications, refetchNotifications, removeNotification, loadingNotificationHistory } = useNotifications()
  const styles = useThemeStyles(NotificationsPageStyles);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader
        title="Notificaciones"
        rightComponent={
          <SimpleThreeDotsMenu
            childrenComponentFunction={(closeParent) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                }}
                onPress={() => {
                  clearNotifications();
                  closeParent();
                }}
              >
                <Ionicons name="trash-outline" color={"black"} size={22} />
                <Text style={styles.text}>Eliminar Todas</Text>
              </TouchableOpacity>
            )}
          />
        }
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={loadingNotificationHistory}
            onRefresh={refetchNotifications}
          />
        }
      >
        {notificationHistory.length === 0 && !loadingNotificationHistory ? (
          <Text style={[{ textAlign: "center", marginTop: 20 }, styles.text]}>
            No tienes notificaciones.
          </Text>
        ) : (
          notificationHistory.map((notif) => (
            <Notification
              key={notif.id}
              notif={notif}
              removeNotification={removeNotification}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const NotificationsPageStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.md,
  },
});
