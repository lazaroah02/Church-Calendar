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

type NotificationsContextType = {
  expoPushToken: string;
  notification: Notifications.Notification | null;
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
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

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
      (notification) => {
        setNotification(notification);
      }
    );

    // When tapped (APP OPEN / BACKGROUND)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data: any = response.notification.request.content.data;
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
  }, [router]);

  // --------------------
  // EFFECT: NOTIFICATION TAPPED WHEN APP WAS CLOSED
  // --------------------
  useEffect(() => {
    (async () => {
      const lastResponse =
        await Notifications.getLastNotificationResponseAsync();

      if (lastResponse) {
        setNotification(lastResponse.notification);

        const data: any = lastResponse.notification.request.content.data;
        if (data?.pathname)
          router.push({
            pathname: data.pathname,
            params: {
              selectedDayParam: JSON.stringify(data.params.selectedDayParam),
            },
          });
      }
    })();
  }, [router]);

  // --------------------
  // CONTEXT VALUE
  // --------------------
  const value = {
    expoPushToken,
    notification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
