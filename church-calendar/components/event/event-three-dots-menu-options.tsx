import { useManageEvents } from "@/hooks/events/useManageEvents";
import { Event } from "@/types/event";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
import { useConfirm } from "../../hooks/useConfirm";
import { useEffect } from "react";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export function EventTrheeDotsmenuOptions({ event }: { event: Event }) {
  const { handleDeleteEvent, isDeletingEvent, errorDeletingEvent } =
    useManageEvents();
  const { confirm, showConfirm, hideConfirm } = useConfirm({
    loading: isDeletingEvent,
    onConfirm: () => handleDeleteEvent(event.id)
  });

  useEffect(() => {
    if(errorDeletingEvent){
      hideConfirm()
    }
  },[errorDeletingEvent, hideConfirm])

  const styles = useThemeStyles(OptionsStyles)
  return (
    <>
      {confirm()}
      <TouchableOpacity
        style={{ flexDirection: "row", gap: 5, alignItems:"center", padding:10 }}
        onPress={showConfirm}
      >
        <Ionicons name="trash-outline" size={20} />
        <Text style={styles.text}>Eliminar</Text>
      </TouchableOpacity>
    </>
  );
}

const OptionsStyles = (theme: AppTheme) => ({
  text:{
    fontSize:theme.fontSizes.lg
  }
})
