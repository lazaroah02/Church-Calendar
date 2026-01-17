import { getVersionsFile } from "@/services/get-versions-file";
import { useCustomToast } from "./useCustomToast";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useConfirm } from "./useConfirm";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { usePlatform } from "./usePlatform";

const STORAGE_KEY = "last-check-for-updates";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const IGNORED_PATHS = ["/", "/welcome", "/splash", "/settings"];

export function useVersionsUpdates() {
  const { isWeb } = usePlatform();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const pathname = usePathname();

  const [updateInfo, setUpdateInfo] = useState<{ url: string | null; version: string | null }>({
    url: null,
    version: null,
  });
  const [checkingForUpdates, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [loadingLastCheck, setLoadingLastCheck] = useState(true);

  const { showConfirm, hideConfirm, confirm: confirmUpdate } = useConfirm({
    onCancel: () => null,
    onConfirm: () => {
      if (updateInfo.url) {
        Linking.openURL(updateInfo.url);
      }
      hideConfirm();
    },
  });

  /** ====== Funciones que solo se ejecutan en móvil ====== */
  const loadLastCheck = useCallback(async () => {
    if (isWeb) { // do not execute on web
      setLoadingLastCheck(false);
      return;
    }
    setLoadingLastCheck(true);
    try {
      const lastCheck = await AsyncStorage.getItem(STORAGE_KEY);
      if (lastCheck) setLastCheck(new Date(lastCheck));
    } catch (error) {
      console.error("[UpdateCheck] Error getting last check:", error);
    } finally {
      setLoadingLastCheck(false);
    }
  }, [isWeb]);

  const storeLastCheck = useCallback(async () => {
    if (isWeb) return; // do not execute on web
    
    try {
      const now = new Date();
      await AsyncStorage.setItem(STORAGE_KEY, now.toISOString());
      setLastCheck(now);
    } catch (error) {
      console.error("[UpdateCheck] Error saving last check:", error);
    }
  }, [isWeb]);

  const checkForUpdate = useCallback(async () => {
    if (isWeb) return; // do not execute on web
    
    setLoading(true);
    try {
      const data = await getVersionsFile();
      const installedVersion = Constants.expoConfig?.version;
      const latestVersion = data.android.version;

      if (installedVersion !== latestVersion) {
        setUpdateInfo({ url: data.android.url, version: data.android.version });
        showConfirm();
      } else if (pathname === "/settings") {
        showSuccessToast({ message: "Tienes la última versión de la aplicación." });
      }
    } catch (err: any) {
      console.warn("[UpdateCheck] Error checking updates:", err.message);
      if (pathname === "/settings") showErrorToast({ message: err.message });
    } finally {
      await storeLastCheck();
      setLoading(false);
    }
  }, [isWeb, pathname, showConfirm, showErrorToast, showSuccessToast, storeLastCheck]);

  /** ====== Effects ====== */
  useEffect(() => {
    loadLastCheck();
  }, [loadLastCheck]);

  useEffect(() => {
    if (isWeb) return; // do not execute on web

    const handleCheck = async () => {
      try {
        if (IGNORED_PATHS.includes(pathname)) return;

        if (lastCheck == null && !loadingLastCheck) {
          await checkForUpdate();
          return;
        }

        if (lastCheck) {
          const now = Date.now();
          const last = lastCheck.getTime();
          if (now - last > ONE_WEEK_MS) {
            await checkForUpdate();
            return;
          }
        }
      } catch (error: any) {
        console.warn("[UpdateCheck] Something went wrong:", error.message);
      }
    };

    handleCheck();
  }, [lastCheck, checkForUpdate, loadingLastCheck, pathname, isWeb]);

  return {
    checkForUpdate: isWeb ? async () => {} : checkForUpdate,
    confirmUpdate: confirmUpdate,
    checkingForUpdates: isWeb ? false : checkingForUpdates,
    lastCheck: isWeb ? null : lastCheck,
    updateInfo: isWeb ? { url: null, version: null } : updateInfo,
  };
}
