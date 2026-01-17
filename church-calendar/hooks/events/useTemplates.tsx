import { EventFormType, EventTemplate } from "@/types/event";
import { useState, useEffect, useCallback } from "react";
import { useUniversalStorage } from "@/hooks/useUniversalStorage";

const STORAGE_KEY = "templates";

export function useTemplates() {
  const { getItem, setItem, removeItem } = useUniversalStorage();
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [loadingTemplates, setLoading] = useState(true);

  // ---- Load templates on mount ----
  const loadTemplates = useCallback(async () => {
    try {
      const json = await getItem(STORAGE_KEY);
      if (json) {
        const parsed: EventTemplate[] = JSON.parse(json);
        const sorted = parsed.sort((a, b) => b.updatedAt - a.updatedAt);
        setTemplates(sorted);
      }
    } catch (error) {
      console.error("Error loading event templates:", error);
    } finally {
      setLoading(false);
    }
  }, [getItem]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // ---- Create template ----
  const createTemplate = useCallback(
    (data: EventFormType & { id?: string }) => {
      const now = Date.now();

      const template: EventTemplate = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      setTemplates((prev) => {
        const updated = [template, ...prev];
        setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
          console.error("Error saving template:", err)
        );
        return updated;
      });

      return template.id;
    },
    [setItem]
  );

  // ---- Update template ----
  const updateTemplate = useCallback(
    (id: string, updates: Partial<EventFormType>) => {
      setTemplates((prev) => {
        const updated = prev.map((tpl) =>
          tpl.id === id ? { ...tpl, ...updates, updatedAt: Date.now() } : tpl
        );

        setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
          console.error("Error updating template:", err)
        );

        return updated;
      });
    },
    [setItem]
  );

  // ---- Remove template ----
  const removeTemplate = useCallback(
    (id: string) => {
      setTemplates((prev) => {
        const updated = prev.filter((tpl) => tpl.id !== id);
        setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
          console.error("Error removing template:", err)
        );
        return updated;
      });
    },
    [setItem]
  );

  // ---- Clear all templates ----
  const clearTemplates = useCallback(() => {
    setTemplates([]);
    removeItem(STORAGE_KEY).catch((err) =>
      console.error("Error clearing templates:", err)
    );
  }, [removeItem]);

  // ---- Manual refetch ----
  const refetchTemplates = useCallback(() => {
    setLoading(true);
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    loadingTemplates,
    createTemplate,
    updateTemplate,
    removeTemplate,
    clearTemplates,
    refetchTemplates,
  };
}

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
