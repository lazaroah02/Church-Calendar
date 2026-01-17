import { MyCustomText } from "@/components/MyCustomText";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { useNotifications } from "@/contexts/notifications-context";
import { useSession } from "@/hooks/auth/useSession";
import { usePlatform } from "@/hooks/usePlatform";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getMonthIntervalFromDate } from "@/lib/calendar/calendar-utils";
import { persister, queryClient } from "@/lib/query-client";
import { removeUserDeviceNotificationInfo } from "@/services/notifications/remove-user-device-notification-info";
import { AppTheme } from "@/theme";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { CalendarUtils } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Logout() {
  const { setSelectedDay, setInterval } = useCalendarEventsContext();
  const [loading, setLoading] = useState(true);
  const todaysDate = useMemo(() => new Date(), []);
  const today = CalendarUtils.getCalendarDateString(todaysDate);
  const { session, updateGuestStatus, updateSession } = useSession();
  const {FCMPushToken} = useNotifications()
  const styles = useThemeStyles(logoutStyles)
  const {isWeb} = usePlatform()

  const handleSignOut = useCallback(async () => {
    // first unsubscribe user from notifications
    removeUserDeviceNotificationInfo({
      token: session?.token ?? "",
      fcm_token: FCMPushToken ?? "",
    })
      .then(() => {
        console.log("User device notification token cleared successfully on log out.");
      })
      .catch((e: Error) =>
        console.warn("Error clearing user notification token:", e.message)
      )
      .finally(() => {
        // then clear session and cached data
        updateSession(null);
        updateGuestStatus(false);
        queryClient.clear();
        queryClient.removeQueries();
        queryClient.invalidateQueries({ queryKey: ["events"] });

        //reset calendar context
        setSelectedDay({
          dateString: today,
          day: todaysDate.getDate(),
          month: todaysDate.getMonth() + 1,
          year: todaysDate.getFullYear(),
          timestamp: todaysDate.getTime(),
        });
        setInterval(getMonthIntervalFromDate(new Date()));
      });

    //remove persisted client data
    if(!isWeb) await persister.removeClient();

    setLoading(false);
  }, [
    session,
    updateSession,
    updateGuestStatus,
    setSelectedDay,
    today,
    todaysDate,
    setInterval,
    FCMPushToken,
    isWeb
  ]);

  useEffect(() => {
    handleSignOut();
  }, [handleSignOut]);

  return loading ? (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size={"large"} color={"#000"} />
      <MyCustomText style={styles.message}>Cerrando Sesión</MyCustomText>
    </SafeAreaView>
  ) : (
    <Redirect href={"/welcome"}/>
  );
}

const logoutStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#EAEAEA",
    gap:20
  },
  message: {
    fontSize: theme.fontSizes.md,
    color: "#000",
    fontFamily: "InterVariable",
  },
});
