import { useQuery } from "@tanstack/react-query";
import { useSession } from "../auth/useSession";
import { getEventReservations } from "@/services/reservations/manage-reservations/get-event-reservations";
import { Reservation } from "@/types/reservation";

export function useManageReservations({ eventId }: { eventId: string }) {
  const { session } = useSession();
  const {
    data,
    error: errorGettingEventReservations,
    isLoading: isLoadingEventReservations,
    refetch: refetchEventReservations,
  } = useQuery({
    queryKey: ["event-reservations", eventId, session?.userInfo.id],
    queryFn: () =>
      getEventReservations({ eventId: eventId, token: session?.token || "" }),
  });

  const eventReservations: Reservation[] = data || [];

  return {
    eventReservations,
    errorGettingEventReservations,
    isLoadingEventReservations,
    refetchEventReservations,
  };
}
