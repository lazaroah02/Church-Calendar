import { updateUserNotificationToken } from "@/services/notifications/update-user-notification-token";
import { useSession } from "../auth/useSession";
import { useNotifications } from "@/contexts/notifications-context";
import { useEffect } from "react";

export function useUserNotificationToken() {
  const { session } = useSession();
  const { expoPushToken } = useNotifications();

  useEffect(() => {
    const handleUpdateUserNotificationToken = async () => {
      try {
        const data = await updateUserNotificationToken({
          new_fcm_token: expoPushToken,
          token: session?.token ?? "",
        });
        console.log("User notification token updated:", data);
      } catch (error) {
        console.error("Failed to update user notification token:", error);
      }
    };

    if (
      expoPushToken &&
      session &&
      expoPushToken !== session.userInfo.fcm_token
    ) {
      handleUpdateUserNotificationToken();
    }

  }, [session, expoPushToken]);

  return null;
}
