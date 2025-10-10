import { EventForm } from "@/components/event/event-form";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { useManageEvents } from "@/hooks/events/useManageEvents";
import { Event } from "@/types/event";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { StatusBar } from "expo-status-bar";
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar style="dark" />
      <EventForm
        isPending={isUpdatingEvent}
        event={event}
        errors={updateEventErrors}
        reset={resetUpdateEventMutation}
        handleSubmit={(values) =>
          handleUpdateEvent({ data: values, eventId: event?.id })
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
