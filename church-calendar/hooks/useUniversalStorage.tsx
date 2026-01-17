import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlatform } from "./usePlatform";
import { useCallback } from "react";

export function useUniversalStorage() {
  const { isWeb } = usePlatform();

  const getItem = useCallback(
    async (key: string): Promise<string | null> => {
      if (isWeb) {
        return localStorage.getItem(key);
      }
      return AsyncStorage.getItem(key);
    },
    [isWeb]
  );

  const setItem = useCallback(
    async (key: string, value: string): Promise<void> => {
      if (isWeb) {
        localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    },
    [isWeb]
  );

  const removeItem = useCallback(
    async (key: string): Promise<void> => {
      if (isWeb) {
        localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    },
    [isWeb]
  );

  return {
    getItem,
    setItem,
    removeItem,
  };
}
