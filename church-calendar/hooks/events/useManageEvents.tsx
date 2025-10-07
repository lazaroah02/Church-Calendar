import { CreateEvent } from "@/types/event";
import { useSession } from "../auth/useSession";
import { useMutation } from "@tanstack/react-query";
import { createEvent } from "@/services/events/management/create-event";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { router } from "expo-router";

export function useManageEvents() {
  const { session } = useSession();
  const {onRefetch} = useCalendarEventsContext()

  const { mutate: handleCreateEvent, isPending: isCreatingEvent, error, reset } = useMutation(
    {
      mutationFn: (data: CreateEvent) =>
        createEvent({ token: session?.token || "", data: data }),
      onSuccess: () => {
        onRefetch()
        router.back()
      },
    }
  );

  const createEventErrors =
    error instanceof Error
      ? JSON.parse(error.message)
      : null;

  return { handleCreateEvent, isCreatingEvent, createEventErrors, reset };
}
