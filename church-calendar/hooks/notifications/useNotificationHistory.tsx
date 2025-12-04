import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "notifications_history";

export interface StoredNotification {
  id: string;
  title?: string | null;
  body?: string | null;
  data?: any;
  receivedAt: number;
}

export function useNotificationsHistory() {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // ---- Load saved notifications on mount ----
  const loadNotifications = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed: StoredNotification[] = JSON.parse(json);
        const sorted = parsed.sort((a, b) => b.receivedAt - a.receivedAt);
        setNotifications(sorted);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ---- Save new notification ----
  const saveNotification = useCallback(
    (notif: Omit<StoredNotification, "receivedAt">) => {
      const newNotif: StoredNotification = {
        ...notif,
        receivedAt: Date.now(),
      };

      setNotifications((prev) => {
        // avoid duplicates
        if (prev.some((n) => n.id === notif.id)) return prev;
        const updated = [newNotif, ...prev];
        // Save to AsyncStorage in background
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(
          (err) => console.error("Error saving notification:", err)
        );
        return updated;
      });
    },
    []
  );

  // ---- Save notification safely (for cold start) ----
  const saveNotificationForColdStarts = useCallback(
    async (notif: Omit<StoredNotification, "receivedAt">) => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const existing: StoredNotification[] = json ? JSON.parse(json) : [];

        const newNotif: StoredNotification = {
          ...notif,
          receivedAt: Date.now(),
        };

        // avoid duplicates
        const updated = existing.some((n) => n.id === newNotif.id)
          ? existing
          : [newNotif, ...existing];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setNotifications(updated);
      } catch (err) {
        console.error("Error saving first-time notification:", err);
      }
    },
    []
  );

  // ---- Remove notification by ID ----
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.error("Error removing notification:", err)
      );
      return updated;
    });
  }, []);

  // ---- Clear all notifications ----
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch((err) =>
      console.error("Error clearing notifications:", err)
    );
  }, []);

  // ---- Manual refetch ----
  const refetchNotifications = useCallback(() => {
    setLoading(true);
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    saveNotification,
    removeNotification,
    clearNotifications,
    refetchNotifications,
    saveNotificationForColdStarts
  };
}
