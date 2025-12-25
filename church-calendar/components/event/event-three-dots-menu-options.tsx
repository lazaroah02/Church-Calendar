import { useManageEvents } from "@/hooks/events/useManageEvents";
import { Event } from "@/types/event";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useConfirm } from "../../hooks/useConfirm";
import { useEffect } from "react";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { notifyAboutEvent } from "@/services/notifications/notify-about-event";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useSession } from "@/hooks/auth/useSession";
import { MyCustomText } from "../MyCustomText";

export function EventTrheeDotsmenuOptions({
  event,
  closeParent,
}: {
  event: Event;
  closeParent: () => void;
}) {
  const styles = useThemeStyles(OptionsStyles);
  const { session } = useSession();
  const { handleDeleteEvent, isDeletingEvent, errorDeletingEvent } =
    useManageEvents();
  const { confirm, showConfirm, hideConfirm } = useConfirm({
    loading: isDeletingEvent,
    onConfirm: () => handleDeleteEvent(event.id),
    onCancel: closeParent,
  });

  const { showSuccessToast, showErrorToast } = useCustomToast();

  useEffect(() => {
    if (errorDeletingEvent) {
      hideConfirm();
    }
  }, [errorDeletingEvent, hideConfirm]);

  const handleNotifyAboutEvent = () => {
    hideEventNotificationConfirm();
    closeParent();
    notifyAboutEvent({ event_id: event.id, token: session?.token || "" })
      .then((data) => {
        showSuccessToast({ message: "Notificación enviada" });
      })
      .catch((error) => {
        showErrorToast({ message: error.message });
        hideEventNotificationConfirm();
      });
  };

  const {
    confirm: confirmEventNotification,
    showConfirm: showEventNotificationConfirm,
    hideConfirm: hideEventNotificationConfirm,
  } = useConfirm({
    loading: false,
    onConfirm: handleNotifyAboutEvent,
    onCancel: closeParent,
  });
  
  return (
    <>
      {confirm({})}
      {confirmEventNotification({})}
      <TouchableOpacity style={styles.touchable} onPress={showConfirm}>
        <Ionicons name="trash-outline" size={20} />
        <MyCustomText style={styles.text}>Eliminar</MyCustomText>
      </TouchableOpacity>
      <View style={{ height: 1, width: "100%", backgroundColor: "black" }} />
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          closeParent();
          router.replace({
            pathname: "/event/edit",
            params: {
              eventInfo: JSON.stringify(event),
            },
          });
        }}
      >
        <Ionicons name="pencil-outline" size={20} />
        <MyCustomText style={styles.text}>Editar</MyCustomText>
      </TouchableOpacity>
      <View style={{ height: 1, width: "100%", backgroundColor: "black" }} />
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          closeParent();
          router.push({
            pathname: "/event/reservations",
            params: { eventId: event.id, eventTitle: event.title },
          });
        }}
      >
        <Ionicons name="book-outline" size={20} />
        <MyCustomText style={styles.text}>Reservaciones</MyCustomText>
      </TouchableOpacity>
      <View style={{ height: 1, width: "100%", backgroundColor: "black" }} />
      <TouchableOpacity
        style={styles.touchable}
        onPress={showEventNotificationConfirm}
      >
        <Ionicons name="notifications-outline" size={20} />
        <MyCustomText style={styles.text}>Notificar a los usuarios</MyCustomText>
      </TouchableOpacity>
    </>
  );
}

const OptionsStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.md,
  },
  touchable: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 10,
  },
});
