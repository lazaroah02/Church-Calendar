import { useManageEvents } from "@/hooks/events/useManageEvents";
import { Event } from "@/types/event";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";
import { useConfirm } from "../../hooks/useConfirm";
import { useEffect } from "react";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { router } from "expo-router";

export function EventTrheeDotsmenuOptions({
  event,
  closeParent,
}: {
  event: Event;
  closeParent: () => void;
}) {
  const { handleDeleteEvent, isDeletingEvent, errorDeletingEvent } =
    useManageEvents();
  const { confirm, showConfirm, hideConfirm } = useConfirm({
    loading: isDeletingEvent,
    onConfirm: () => handleDeleteEvent(event.id),
  });

  useEffect(() => {
    if (errorDeletingEvent) {
      hideConfirm();
    }
  }, [errorDeletingEvent, hideConfirm]);

  const styles = useThemeStyles(OptionsStyles);
  return (
    <>
      {confirm()}
      <TouchableOpacity style={styles.touchable} onPress={showConfirm}>
        <Ionicons name="trash-outline" size={20} />
        <Text style={styles.text}>Eliminar</Text>
      </TouchableOpacity>
      <View style={{ height: 1, width: "100%", backgroundColor: "black" }} />
      <TouchableOpacity
        style={styles.touchable}
        onPress={() =>
          router.replace({
            pathname: "/event/edit",
            params: {
              eventInfo: JSON.stringify(event),
            },
          })
        }
      >
        <Ionicons name="pencil-outline" size={20} />
        <Text style={styles.text}>Editar</Text>
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
        <Text style={styles.text}>Reservaciones</Text>
      </TouchableOpacity>
    </>
  );
}

const OptionsStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.lg,
  },
  touchable: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 10,
  },
});
