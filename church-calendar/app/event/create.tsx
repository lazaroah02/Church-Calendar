import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useManageEvents } from "@/hooks/events/useManageEvents";
import { EventForm } from "@/components/event/event-form";
import { router } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";

export default function CreateEvent() {
  const {
    handleCreateEvent,
    isCreatingEvent,
    createEventErrors,
    resetCreateEventMutation,
  } = useManageEvents();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar style="dark" />
      <PageHeader
        title="Crear Evento"
        rightComponent={
          <SimpleThreeDotsMenu modalStyles={{ right: 30, top: 70 }} childrenComponentFunction={(closeParent) => null}>
          </SimpleThreeDotsMenu>
        }
      />
      <EventForm
        isPending={isCreatingEvent}
        errors={createEventErrors}
        reset={resetCreateEventMutation}
        handleSubmit={(values) => handleCreateEvent(values)}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}
