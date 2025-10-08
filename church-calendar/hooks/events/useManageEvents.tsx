import { CreateEvent } from "@/types/event";
import { useSession } from "../auth/useSession";
import { useMutation } from "@tanstack/react-query";
import { createEvent } from "@/services/events/management/create-event";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { router } from "expo-router";
import { deleteEvent } from "@/services/events/management/delete-event";
import { useCustomToast } from "../useCustomToast";

export function useManageEvents() {
  const { session } = useSession();
  const { onRefetch } = useCalendarEventsContext();
  const {showSuccessToast, showErrorToast} = useCustomToast()

  const {
    mutate: handleCreateEvent,
    isPending: isCreatingEvent,
    error,
    reset,
  } = useMutation({
    mutationFn: (data: CreateEvent) =>
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
      showSuccessToast("Evento eliminado con éxito!");
    },
    onError:() => {
      showErrorToast("Error al eliminar el evento. Revisa tu conexión a internet.")
    }
  });

  const createEventErrors =
    error instanceof Error ? JSON.parse(error.message) : null;

  return {
    handleCreateEvent,
    isCreatingEvent,
    createEventErrors,
    reset,
    handleDeleteEvent,
    isDeletingEvent,
    errorDeletingEvent,
    resetDeleteEventMutation,
  };
}
