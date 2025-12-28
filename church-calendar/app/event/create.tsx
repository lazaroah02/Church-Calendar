import { SafeAreaView } from "react-native-safe-area-context";

import { useManageEvents } from "@/hooks/events/useManageEvents";
import { EventForm } from "@/components/event/event-form";
import { router } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { CreateEventTrheeDotsmenuOptions } from "@/components/event/create-event-three-dots-menu-options";
import { useTemplates } from "@/hooks/events/useTemplates";
import { useState } from "react";
import { EventTemplate } from "@/types/event";

export default function CreateEvent() {
  const {
    handleCreateEvent,
    isCreatingEvent,
    createEventErrors,
    resetCreateEventMutation,
  } = useManageEvents();

  const [importedTemplate, setImportedTemplate] =
    useState<EventTemplate | null>(null);

  const { templates } = useTemplates();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader
        title="Crear Evento"
        rightComponent={
          <SimpleThreeDotsMenu
            modalStyles={{ right: 30, top: 70 }}
            childrenComponentFunction={(closeParent) => (
              <CreateEventTrheeDotsmenuOptions
                closeParent={closeParent}
                templates={templates}
                handleImportTemplate={(selectedTemplate: EventTemplate) => {
                  setImportedTemplate(selectedTemplate);
                }}
              />
            )}
          ></SimpleThreeDotsMenu>
        }
      />
      <EventForm
        event={importedTemplate}
        isPending={isCreatingEvent}
        errors={createEventErrors}
        reset={resetCreateEventMutation}
        handleSubmit={(values) => handleCreateEvent(values)}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}
