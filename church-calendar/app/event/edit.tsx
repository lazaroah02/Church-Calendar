import { EventForm } from "@/components/event/event-form";
import { PageHeader } from "@/components/PageHeader";
import { useEventFormValues } from "@/hooks/events/useEventFormValues";
import { useManageEvents } from "@/hooks/events/useManageEvents";
import { Event } from "@/types/event";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventEdit() {
  const searchParams = useSearchParams();
  const eventInfo = searchParams.get("eventInfo") as string | undefined;
  const event: Event | null = eventInfo ? JSON.parse(eventInfo) : null;
  const {
    updateEventErrors,
    handleUpdateEvent,
    isUpdatingEvent,
    resetUpdateEventMutation,
  } = useManageEvents();

  const navigation = useNavigation();

  useEffect(() => {
    if (!event) {
      router.replace("/+not-found");
      return;
    }
  }, [event]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type === "GO_BACK") {
          e.preventDefault();

          router.replace({
            pathname: "/event/details",
            params: {
              event: JSON.stringify(event),
            },
          });
        }
      });

      return unsubscribe;
    }, [navigation, event])
  );

  const { formValues, handleFieldChange } = useEventFormValues({
    resetMutation: resetUpdateEventMutation,
    defaultValues: event,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader title="Editar Evento" />
      <EventForm
        isPending={isUpdatingEvent}
        formValues={formValues}
        errors={updateEventErrors}
        handleFieldChange={handleFieldChange}
        handleSubmit={() =>
          handleUpdateEvent({ data: formValues, eventId: event?.id })
        }
        onCancel={() =>
          router.replace({
            pathname: "/event/details",
            params: {
              event: JSON.stringify(event),
            },
          })
        }
      />
    </SafeAreaView>
  );
}
