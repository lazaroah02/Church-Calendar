import { getVersionsFile } from "@/services/get-versions-file";
import { useCustomToast } from "./useCustomToast";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useConfirm } from "./useConfirm";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InteractionManager } from "react-native";

const STORAGE_KEY = "last-check-for-updates";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useVersionsUpdates() {
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const [updateInfo, setUpdateInfo] = useState<{
    url: string | null;
    version: string | null;
  }>({ url: null, version: null });
  const [checkingForUpdates, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [loadingLastCheck, setLoadingLastCheck] = useState(true);

  const {
    showConfirm,
    hideConfirm,
    confirm: confirmUpdate,
  } = useConfirm({
    onCancel: () => null,
    onConfirm: () => {
      if (updateInfo.url) {
        Linking.openURL(updateInfo.url);
      }
      hideConfirm();
    },
  });

  const loadLastCheck = useCallback(async () => {
    setLoadingLastCheck(true);
    try {
      const lastCheck = await AsyncStorage.getItem(STORAGE_KEY);
      if (lastCheck) {
        setLastCheck(new Date(lastCheck));
      }
    } catch (error) {
      console.error(
        "Error getting last check for updates date from storage:",
        error
      );
    } finally {
      setLoadingLastCheck(false);
    }
  }, []);

  const storeLastCheck = useCallback(async () => {
    try {
      const now = new Date();
      AsyncStorage.setItem(STORAGE_KEY, now.toISOString()).catch((err) =>
        console.error("Error saving last chek for updates date:", err)
      );
      setLastCheck(now);
    } catch (error) {
      console.error(
        "Error getting last check for updates date from storage:",
        error
      );
    }
  }, []);

  const checkForUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVersionsFile();
      const installedVersion = Constants.expoConfig?.version;
      const latestVersion = data.android.version;
      if (installedVersion !== latestVersion) {
        setUpdateInfo({ url: data.android.url, version: data.android.version });
        showConfirm();
      } else {
        showSuccessToast({ message: "Tienes la última versión." });
      }
    } catch (err: any) {
      showErrorToast({ message: err.message });
    } finally {
      await storeLastCheck();
      setLoading(false);
    }
  }, [showConfirm, showErrorToast, showSuccessToast, storeLastCheck]);

  useEffect(() => {
    loadLastCheck();
  }, [loadLastCheck]);

  useEffect(() => {
    if (lastCheck == null && !loadingLastCheck) {
      setTimeout(checkForUpdate, 5000);
      return;
    }
    if (lastCheck) {
      const now = Date.now();
      const last = lastCheck?.getTime();

      if (now - last > ONE_WEEK_MS) {
        setTimeout(checkForUpdate, 5000);
        return;
      }
    }
  }, [lastCheck, checkForUpdate, loadingLastCheck]);

  return {
    checkForUpdate,
    confirmUpdate,
    checkingForUpdates,
    lastCheck,
    updateInfo,
  };
}
