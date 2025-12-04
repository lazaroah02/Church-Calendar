import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useNotificationsHistory } from "@/hooks/notifications/useNotificationHistory";

type NotificationsContextType = {
  expoPushToken: string;
  notificationHistory: ReturnType<
    typeof useNotificationsHistory
  >["notificationHistory"];
  refetchNotifications: ReturnType<
    typeof useNotificationsHistory
  >["refetchNotifications"];
  removeNotification: ReturnType<
    typeof useNotificationsHistory
  >["removeNotification"];
  clearNotifications: ReturnType<
    typeof useNotificationsHistory
  >["clearNotifications"];
  loadingNotificationHistory: ReturnType<
    typeof useNotificationsHistory
  >["loadingNotificationHistory"];
};

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// --------------------
// REGISTER TOKEN
// --------------------
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    alert("Debes usar un dispositivo físico para notificaciones");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("No se concedieron permisos de notificaciones");
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) throw new Error("Project ID not found");

  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}

// --------------------
// PROVIDER
// --------------------
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState("");

  const {
    notificationHistory,
    refetchNotifications,
    removeNotification,
    saveNotification,
    saveNotificationForColdStarts,
    clearNotifications,
    loadingNotificationHistory
  } = useNotificationsHistory();
  const router = useRouter();

  // --------------------
  // EFFECT: TOKEN + LISTENERS
  // --------------------
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token ?? "")
    );

    // When notification is received (APP OPEN)
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notif) => {

        // <<< ADDED: Save received notification
        saveNotification({
          id: notif.request.identifier,
          title: notif.request.content.title,
          body: notif.request.content.body,
          data: notif.request.content.data,
        });
      }
    );

    // When tapped (APP OPEN / BACKGROUND)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notif = response.notification;

        // <<< ADDED: Save tapped notification
        saveNotification({
          id: notif.request.identifier,
          title: notif.request.content.title,
          body: notif.request.content.body,
          data: notif.request.content.data,
        });

        const data: any = notif.request.content.data;
        if (data?.pathname)
          router.push({
            pathname: data.pathname,
            params: {
              selectedDayParam: JSON.stringify(data.params.selectedDayParam),
            },
          });
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router, saveNotification]);

  // --------------------
  // EFFECT: NOTIFICATION TAPPED WHEN APP WAS CLOSED
  // --------------------
  useEffect(() => {
    (async () => {
      const lastResponse =
        await Notifications.getLastNotificationResponseAsync();

      if (lastResponse) {
        const notif = lastResponse.notification;

        // <<< ADDED: Save last notification (cold start)
        saveNotificationForColdStarts({
          id: notif.request.identifier,
          title: notif.request.content.title,
          body: notif.request.content.body,
          data: notif.request.content.data,
        });

        const data: any = notif.request.content.data;
        if (data?.pathname)
          router.push({
            pathname: data.pathname,
            params: {
              selectedDayParam: JSON.stringify(data.params.selectedDayParam),
            },
          });
      }
    })();
  }, [router, saveNotificationForColdStarts]);

  const value = {
    expoPushToken,
    notificationHistory,
    refetchNotifications,
    removeNotification,
    clearNotifications,
    loadingNotificationHistory
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
