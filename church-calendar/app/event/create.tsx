import { SafeAreaView } from "react-native-safe-area-context";

import { useManageEvents } from "@/hooks/events/useManageEvents";
import {
  createFormValuesInitialData,
  EventForm,
} from "@/components/event/event-form";
import { router } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { CreateEventTrheeDotsmenuOptions } from "@/components/event/create-event-three-dots-menu-options";
import { useTemplates } from "@/hooks/events/useTemplates";
import { useEventFormValues } from "@/hooks/events/useEventFormValues";
import { EventTemplate } from "@/types/event";

export default function CreateEvent() {
  const {
    handleCreateEvent,
    isCreatingEvent,
    createEventErrors,
    resetCreateEventMutation,
  } = useManageEvents();

  const { templates } = useTemplates();

  const { formValues, setFormValues, handleFieldChange } = useEventFormValues({
    resetMutation: resetCreateEventMutation,
    defaultValues: { groups: [1] }, //general group
  });

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
                  setFormValues(createFormValuesInitialData(selectedTemplate));
                }}
              />
            )}
          ></SimpleThreeDotsMenu>
        }
      />
      <EventForm
        formValues={formValues}
        isPending={isCreatingEvent}
        errors={createEventErrors}
        handleSubmit={() => handleCreateEvent(formValues)}
        handleFieldChange={handleFieldChange}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}
