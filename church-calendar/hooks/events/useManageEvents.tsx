import { EventFormType } from "@/types/event";
import { useSession } from "../auth/useSession";
import { useMutation } from "@tanstack/react-query";
import { createEvent } from "@/services/events/management/create-event";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { router } from "expo-router";
import { deleteEvent } from "@/services/events/management/delete-event";
import { useCustomToast } from "../useCustomToast";
import { updateEvent } from "@/services/events/management/update-event";

export function useManageEvents() {
  const { session } = useSession();
  const { onRefetch } = useCalendarEventsContext();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const {
    mutate: handleCreateEvent,
    isPending: isCreatingEvent,
    error: errorCreatingEvent,
    reset: resetCreateEventMutation,
  } = useMutation({
    mutationFn: (data: EventFormType) =>
      createEvent({ token: session?.token || "", data: data }),
    onSuccess: () => {
      onRefetch();
      router.back();
    },
  });

  const {
    mutate: handleDeleteEvent,
    isPending: isDeletingEvent,
    error: errorDeletingEvent,
    reset: resetDeleteEventMutation,
  } = useMutation({
    mutationFn: (eventId: number | string) =>
      deleteEvent({ token: session?.token || "", eventId: eventId }),
    onSuccess: () => {
      onRefetch();
      router.back();
      showSuccessToast({ message: "Evento eliminado con éxito!" });
    },
    onError: () => {
      showErrorToast({
        message: "Error al eliminar el evento. Revisa tu conexión a internet.",
      });
    },
  });

  const {
    mutate: handleUpdateEvent,
    isPending: isUpdatingEvent,
    error: errorUpdatingEvent,
    reset: resetUpdateEventMutation,
  } = useMutation({
    mutationFn: ({
      data,
      eventId,
    }: {
      data: EventFormType;
      eventId: number | string | undefined;
    }) =>
      updateEvent({
        token: session?.token || "",
        data: data,
        eventId: eventId,
      }),
    onSuccess: (data) => {
      onRefetch();
      router.replace({
        pathname: "/event/details",
        params: {
          event: JSON.stringify(data),
        },
      });
    },
  });

  const createEventErrors =
    errorCreatingEvent instanceof Error
      ? JSON.parse(errorCreatingEvent.message)
      : null;

  const updateEventErrors =
    errorUpdatingEvent instanceof Error
      ? JSON.parse(errorUpdatingEvent.message)
      : null;

  return {
    handleCreateEvent,
    isCreatingEvent,
    createEventErrors,
    resetCreateEventMutation,
    handleDeleteEvent,
    isDeletingEvent,
    errorDeletingEvent,
    resetDeleteEventMutation,
    handleUpdateEvent,
    isUpdatingEvent,
    updateEventErrors,
    resetUpdateEventMutation,
  };
}
