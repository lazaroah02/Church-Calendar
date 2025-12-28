import { SafeAreaView } from "react-native-safe-area-context";
import { EventForm } from "@/components/event/event-form";
import { router } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { useTemplates } from "@/hooks/events/useTemplates";

export default function CreateTemplate() {
  const { createTemplate } = useTemplates();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader title="Crear Plantilla" />
      <EventForm
        isPending={false}
        errors={null}
        reset={() => null}
        handleSubmit={(values) => {
          createTemplate(values);
          router.back();
        }}
        onCancel={() => router.back()}
        submitButtonText={{ text: "Guardar", loading: "Guardando" }}
      />
    </SafeAreaView>
  );
}
