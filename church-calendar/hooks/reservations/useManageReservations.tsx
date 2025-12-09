import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "../auth/useSession";
import { getEventReservations } from "@/services/reservations/manage-reservations/get-event-reservations";
import { Reservation } from "@/types/reservation";
import { useMemo } from "react";

export function useManageReservations({ eventId }: { eventId: string }) {
  const { session } = useSession();
  const {
    data,
    error: errorGettingEventReservations,
    isLoading: isLoadingEventReservations,
    refetch: refetchEventReservations,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage: hasMoreReservations,
  } = useInfiniteQuery({
    queryKey: ["event-reservations", eventId],
    queryFn: ({ pageParam = 1 }) =>
      getEventReservations({
        eventId: eventId,
        token: session?.token || "",
        pageParam: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return parseInt(new URL(lastPage.next).searchParams.get("page") || "1");
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const eventReservations: Reservation[] = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const eventReservationsCount: number = useMemo(
    () => data?.pages[0]?.count || 0,
    [data]
  );

  return {
    eventReservations,
    errorGettingEventReservations,
    isLoadingEventReservations,
    refetchEventReservations,
    eventReservationsCount,
    hasMoreReservations,
    fetchNextPage,
    isFetchingNextPage
  };
}
