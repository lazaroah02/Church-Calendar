import { updateUserNotificationTokenAndTimezone } from "@/services/notifications/update-user-notification-token-and-timezone";
import { useSession } from "../auth/useSession";
import { useNotifications } from "@/contexts/notifications-context";
import { useEffect } from "react";

export function useUserNotificationToken() {
  const { session, updateSession } = useSession();
  const { expoPushToken } = useNotifications();

  useEffect(() => {
    console.log(
      "Checking if user notification token and timezone need update..."
    );
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
          sessionCopy.userInfo.fcm_token = expoPushToken
          updateSession(sessionCopy);
        }
      } catch (error) {
        console.error(
          "Failed to update user notification token and timezone:",
          error
        );
      }
    };

    if (
      expoPushToken &&
      session &&
      (expoPushToken !== session.userInfo.fcm_token ||
        session.userInfo.timezone !== currentDeviceTimezone)
    ) {
      expoPushToken !== session.userInfo.fcm_token &&
        console.log("FCM token has changed, updating...");
      session.userInfo.timezone !== currentDeviceTimezone &&
        console.log("Timezone has changed, updating...");
      handleUpdateUserNotificationTokenAndTimezone();
    } else {
      console.log("No update needed for user notification token and timezone.");
    }
  }, [session, expoPushToken, updateSession]);

  return null;
}
