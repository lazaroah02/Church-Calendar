import { useSession } from "@/hooks/auth/useSession";
import { useReservation } from "@/hooks/reservations/useReservation";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Event } from "@/types/event";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

export function ReserveEvent({ event }: { event?: Event | null }) {
  const { session } = useSession();
  const styles = useThemeStyles(reserveEventStyles);
  const {
    isReserved,
    isCheckingReservationStatus,
    handleMakeReservation,
    isMakingReservation,
    handleRemoveReservation,
    isRemovingReservation,
  } = useReservation({eventId:event?.id});

  const pending = isMakingReservation || isRemovingReservation || isCheckingReservationStatus;

  const handlePress = () => {
    if (isReserved) {
      handleRemoveReservation();
    } else {
      handleMakeReservation();
    }
  };

  if (!event?.open_to_reservations || !session || event.is_canceled || !event?.visible) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isReserved && styles.buttonActive,
        pending && { opacity: 0.7 },
      ]}
      onPress={handlePress}
      disabled={pending}
    >
      {pending ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={25} color="#fff" />
        </View>
      ) : (
        <>
          <Text style={styles.buttonText}>
            {isReserved ? "Anotado" : "Anotarse"}
          </Text>
          {isReserved ? (
            <Ionicons name="checkbox-outline" size={20} color="#fff" />
          ) : (
            <Ionicons name="square-outline" size={20} color="#fff" />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const reserveEventStyles = (theme: AppTheme) => ({
  button: {
    backgroundColor: "#5D3731",
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  buttonActive: {
    backgroundColor: "#3D2520",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
