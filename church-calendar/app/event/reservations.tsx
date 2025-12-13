import { MyCustomText } from "@/components/MyCustomText";
import { PageHeader } from "@/components/PageHeader";
import { ReservationCard } from "@/components/reservation/reservation-card";
import { useManageReservations } from "@/hooks/reservations/useManageReservations";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { useSearchParams } from "expo-router/build/hooks";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventReservations() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") as string | undefined;
  const eventTitle = searchParams.get("eventTitle") as string | undefined;

  const styles = useThemeStyles(EventReservationsStyles);

  const {
    eventReservations,
    refetchEventReservations,
    isLoadingEventReservations,
    eventReservationsCount,
    fetchNextPage,
    hasMoreReservations,
    isFetchingNextPage
  } = useManageReservations({
    eventId: eventId || "",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader title={`Reservaciones para ${eventTitle}`} />
      <FlatList
        data={eventReservations}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 15 }}>
            <ReservationCard key={item.id} reservation={item} />
          </View>
        )}
        ListEmptyComponent={
          <MyCustomText style={styles.noReservationsMessage}>
            No hay reservaciones.
          </MyCustomText>
        }
        ListHeaderComponent={
          <MyCustomText style={styles.total}>Total: {eventReservationsCount}</MyCustomText>
        }
        onRefresh={refetchEventReservations}
        refreshing={isLoadingEventReservations}
        onEndReached={() =>
          hasMoreReservations && !isFetchingNextPage && !isLoadingEventReservations && fetchNextPage()
        }
        ListFooterComponent={<View style={{ padding: 20, justifyContent: "center" }}>
            {isFetchingNextPage && (
              <MyCustomText style={{ textAlign: "center" }}>
                Cargando mas reservaciones...
              </MyCustomText>
            )}
            {!isFetchingNextPage && !isLoadingEventReservations && !hasMoreReservations && eventReservations.length > 0 && (
              <MyCustomText style={{ textAlign: "center" }}>No hay mas reservaciones</MyCustomText>
            )}
          </View>}
      />
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
  total: {
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.lg,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 25,
  },
  noReservationsMessage: {
    marginTop: "60%",
    fontFamily: "LexendBold",
    fontSize: theme.fontSizes.lg,
    textAlign: "center",
  },
});
