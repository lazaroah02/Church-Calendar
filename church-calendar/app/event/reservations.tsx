import { PageHeader } from "@/components/PageHeader";
import { ReservationCard } from "@/components/reservation/reservation-card";
import { useManageReservations } from "@/hooks/reservations/useManageReservations";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { useSearchParams } from "expo-router/build/hooks";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventReservations() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") as string | undefined;
  const eventTitle = searchParams.get("eventTitle") as string | undefined;

  const styles = useThemeStyles(EventReservationsStyles);

  const { eventReservations } = useManageReservations({
    eventId: eventId || "",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader title={`Reservaciones para ${eventTitle}`} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {eventReservations.length === 0 ? (
          <Text style={styles.noReservationsMessage}>
            No hay reservaciones.
          </Text>
        ) : (
          eventReservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const EventReservationsStyles = (theme: AppTheme) => ({
  scrollContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  noReservationsMessage: {
    marginTop: "80%",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.lg,
    textAlign: "center",
  },
});
