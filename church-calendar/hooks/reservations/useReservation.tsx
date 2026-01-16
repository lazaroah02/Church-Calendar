import { makeReservation } from "@/services/reservations/make-reservation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../auth/useSession";
import { useCustomToast } from "../useCustomToast";
import { removeReservation } from "@/services/reservations/remove-reservation";
import { checkReservation } from "@/services/reservations/check-reservation";
import { useEffect, useRef } from "react";
import { Event } from "@/types/event";

export function useReservation({
  event,
  eventId,
}: {
  event: Event | null | undefined;
  eventId: number | string | undefined;
}) {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const { showErrorToast, showSuccessToast, showWarningToast } =
    useCustomToast();

  const reservationQueryKey = [
    "event-reservation",
    eventId,
    session?.userInfo.id,
  ];
  const ableToReserve =
    eventId != null &&
    event?.open_to_reservations === true &&
    event?.is_canceled === false &&
    event?.visible === true &&
    session !== null;

  // reservation status
  const {
    data,
    isLoading: isCheckingReservationStatus,
    refetch: refetchReservationStatus,
    error: errorCheckingReservationStatus,
  } = useQuery({
    queryKey: reservationQueryKey,
    queryFn: () =>
      checkReservation({ token: session?.token ?? "", eventId: eventId }),
    retry(failureCount, error) {
      if (failureCount <= 3) {
        return true;
      }
      return false;
    },
    enabled: ableToReserve,
  });
  const isReserved: boolean = data?.reservation ?? false;

  // show a message to the user in case reservation status check was not possible
  const hasShownErrorRef = useRef(false);
  useEffect(() => {
    if (errorCheckingReservationStatus && !hasShownErrorRef.current) {
      hasShownErrorRef.current = true;
      showWarningToast({
        message:
          "No se pudo verificar tu estado de reserva, pero aún puedes intentar anotarte.",
      });
    }
  }, [errorCheckingReservationStatus, showWarningToast]);

  function updateReservationStatusInCache(reserved: boolean) {
    queryClient.setQueryData(
      reservationQueryKey,
      (oldData: ReservationStatus) => {
        return {
          ...oldData,
          reservation: reserved,
        };
      }
    );
  }

  // make reservation
  const {
    mutate: handleMakeReservation,
    error: errorMakingReservation,
    isPending: isMakingReservation,
  } = useMutation({
    mutationFn: () => {
      return makeReservation({ eventId: eventId, token: session?.token ?? "" });
    },
    onError: (error) => {
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Error al hacer la reserva. Inténtalo mas tarde.",
      });
    },
    onSuccess: (data) => {
      updateReservationStatusInCache(true);
      showSuccessToast({
        message: data.message ?? "Reserva realizada con éxito",
      });
    },
  });

  // remove reservation
  const {
    mutate: handleRemoveReservation,
    error: errorRemovingReservation,
    isPending: isRemovingReservation,
  } = useMutation({
    mutationFn: () => {
      return removeReservation({
        eventId: eventId,
        token: session?.token ?? "",
      });
    },
    onError: (error) => {
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Error en la operación. Inténtalo mas tarde",
      });
    },
    onSuccess: (data) => {
      updateReservationStatusInCache(false);
      showSuccessToast({
        message: data.message ?? "Operación realizada con éxito",
      });
    },
  });

  return {
    isReserved,
    errorCheckingReservationStatus,
    isCheckingReservationStatus,
    refetchReservationStatus,
    handleMakeReservation,
    errorMakingReservation,
    isMakingReservation,
    handleRemoveReservation,
    errorRemovingReservation,
    isRemovingReservation,
  };
}

interface ReservationStatus {
  message: string;
  reservation: boolean;
}
