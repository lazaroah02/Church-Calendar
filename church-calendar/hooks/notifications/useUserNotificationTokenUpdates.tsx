import { updateUserNotificationTokenAndTimezone } from "@/services/notifications/update-user-notification-token-and-timezone";
import { useSession } from "../auth/useSession";
import { useNotifications } from "@/contexts/notifications-context";
import { useEffect } from "react";
import { useNetworkStatus } from "../useNetworkStatus";

export function useUserNotificationTokenUpdates() {
  const { session, updateSession } = useSession();
  const { expoPushToken } = useNotifications();
  const isConnected = useNetworkStatus()

  useEffect(() => {
    if (!session || !expoPushToken || !isConnected) return;

    const currentDeviceTimezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleUpdateUserNotificationTokenAndTimezone = async () => {
      try {
        const data = await updateUserNotificationTokenAndTimezone({
          new_fcm_token: expoPushToken,
          token: session?.token ?? "",
        });
        console.log("User notification token and timezone updated:", data);
        if (session) {
          const sessionCopy = JSON.parse(JSON.stringify(session));
          sessionCopy.userInfo.timezone = currentDeviceTimezone;
          sessionCopy.userInfo.fcm_token = expoPushToken;
          updateSession(sessionCopy);
        }
      } catch (error) {
        console.error(
          "Failed to update user notification token and timezone:",
          error
        );
      }
    };

    const tokenHasChanged = expoPushToken !== session?.userInfo.fcm_token;
    const timezoneHasChanged =
      session.userInfo.timezone !== currentDeviceTimezone;

    if (tokenHasChanged || timezoneHasChanged) {
      tokenHasChanged && console.log("FCM token has changed, updating...");
      timezoneHasChanged && console.log("Timezone has changed, updating...");
      handleUpdateUserNotificationTokenAndTimezone();
    } else {
      console.log("FCM Token up to date:", expoPushToken);
    }
  }, [session, expoPushToken, updateSession, isConnected]);

  return null;
}
