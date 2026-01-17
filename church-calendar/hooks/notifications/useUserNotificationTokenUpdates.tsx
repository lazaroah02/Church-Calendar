import { updateUserDeviceNotificationInfo } from "@/services/notifications/update-user-device-notification-info";
import { useSession } from "../auth/useSession";
import { useNotifications } from "@/contexts/notifications-context";
import { useEffect } from "react";
import { useNetworkStatus } from "../useNetworkStatus";
import { DevicePushNotificationInfo } from "@/types/notification";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { usePlatform } from "../usePlatform";

export function useUserDeviceNotificationInfoUpdates() {
  const { session, updateSession } = useSession();
  const { FCMPushToken } = useNotifications();
  const isConnected = useNetworkStatus()
  const {isWeb} = usePlatform()

  useEffect(() => {
    if (!session || !FCMPushToken || !isConnected || isWeb) return;

    const currentDeviceTimezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    const platform = Platform.OS === "android"? 'android' : 'ios';
    const type = platform === 'android' ? 'fcm' : 'apns';
    const deviceName = Constants.deviceName ?? 'unknown';

    const handleUpdateUserDeviceNotificationInfo = async () => {
      try {
        const payload: DevicePushNotificationInfo = {
          fcm_token: FCMPushToken,
          device_name: deviceName,
          timezone: currentDeviceTimezone,  
          platform: platform,
          type: type,
        }
        const data = await updateUserDeviceNotificationInfo({
          data: payload,
          token: session?.token ?? "",
        });
        console.log("User device notification info updated:", data.news_devices_notification_info);
        if (session) {
          const sessionCopy = JSON.parse(JSON.stringify(session));
          sessionCopy.userInfo.devices_push_notification_info = data.news_devices_notification_info;
          updateSession(sessionCopy);
        }
      } catch (error) {
        console.error(
          "Failed to update user device notification info:",
          error
        );
      }
    };

    // Checkif the user device info needs to be updated
    const currentDeviceInfoInSession = session.userInfo.devices_push_notification_info.find((device => device.fcm_token === FCMPushToken)
    )
    const deviceInfoChanged = currentDeviceInfoInSession == null
      || currentDeviceInfoInSession.timezone !== currentDeviceTimezone
      || currentDeviceInfoInSession.platform !== platform
      || currentDeviceInfoInSession.device_name !== deviceName
      || currentDeviceInfoInSession.type !== type
      || currentDeviceInfoInSession.fcm_token !== FCMPushToken;

    if (currentDeviceInfoInSession == null || deviceInfoChanged) {
      console.log("Device notification info has changed or not found, updating...");
      handleUpdateUserDeviceNotificationInfo();
    } else {
      console.log("Device notification info up to date:", currentDeviceInfoInSession);
    }
  }, [session, FCMPushToken, updateSession, isConnected]);

  return null;
}
