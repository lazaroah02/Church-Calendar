import { createFormValuesInitialData } from "@/components/event/event-form";
import { EventFormType } from "@/types/event";
import { useState } from "react";

export function useEventFormValues({
  resetMutation = () => null,
  defaultValues = null,
}: {
  resetMutation?: () => void;
  defaultValues?: Event | null;
}) {
  const [formValues, setFormValues] = useState<EventFormType>(
    createFormValuesInitialData(defaultValues)
  );

  const handleFieldChange = (
    key: keyof typeof formValues,
    value: string | boolean | Date | number[] | undefined | number | null
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    resetMutation();
  };

  return { formValues, setFormValues, handleFieldChange };
}
