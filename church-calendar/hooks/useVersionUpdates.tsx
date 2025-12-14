import { getVersionsFile } from "@/services/get-versions-file";
import { useCustomToast } from "./useCustomToast";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useConfirm } from "./useConfirm";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";

const STORAGE_KEY = "last-check-for-updates";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const IGNORED_PATHS = ["/", "/welcome", " /splash", "/settings"];

export function useVersionsUpdates() {
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const [updateInfo, setUpdateInfo] = useState<{
    url: string | null;
    version: string | null;
  }>({ url: null, version: null });
  const [checkingForUpdates, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [loadingLastCheck, setLoadingLastCheck] = useState(true);
  const pathname = usePathname();

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
    // console.info("[UpdateCheck] Recovering last check for app updates ...");
    setLoadingLastCheck(true);
    try {
      const lastCheck = await AsyncStorage.getItem(STORAGE_KEY);
      if (lastCheck) {
        // console.info(
        //   "[UpdateCheck] Last Check for Updates at: ",
        //   new Date(lastCheck).toLocaleDateString()
        // );
        setLastCheck(new Date(lastCheck));
      }
    } catch (error) {
      console.error(
        "[UpdateCheck] Error getting last check for updates date from storage:",
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
        console.error(
          "[UpdateCheck] Error saving last chek for updates date:",
          err
        )
      );
      setLastCheck(now);
    } catch (error) {
      console.error(
        "[UpdateCheck] Error getting last check for updates date from storage:",
        error
      );
    }
  }, []);

  const checkForUpdate = useCallback(async () => {
    setLoading(true);
    console.info(
      "[UpdateCheck] Connecting the server to check for new updates ..."
    );
    try {
      const data = await getVersionsFile();
      const installedVersion = Constants.expoConfig?.version;
      const latestVersion = data.android.version;
      if (installedVersion !== latestVersion) {
        setUpdateInfo({ url: data.android.url, version: data.android.version });
        showConfirm();
      } else {
        console.info("[UpdateCheck] App is up to date!");
        if (pathname === "/settings") {
          showSuccessToast({ message: "Tienes la última versión de la aplicación." });
        }
      }
    } catch (err: any) {
      console.warn("[UpdateCheck] Error checking for updates: ", err.message);
      if (pathname === "/settings") {
        showErrorToast({ message: err.message });
      }
    } finally {
      await storeLastCheck();
      setLoading(false);
    }
  }, [showConfirm, showErrorToast, showSuccessToast, storeLastCheck, pathname]);

  useEffect(() => {
    loadLastCheck();
  }, [loadLastCheck]);

  useEffect(() => {
    const handleCheck = async () => {
      try {
        // evoid checking for updates on undesired pages
        if (IGNORED_PATHS.includes(pathname)) {
          // console.info(
          //   `[UpdateCheck] Updates checking skipped due to ignored path. Current Path: ${pathname}`
          // );
          return;
        }
        //if never checked for updates, try to check
        if (lastCheck == null && !loadingLastCheck) {
          await checkForUpdate();
          return;
        }

        if (lastCheck) {
          const now = Date.now();
          const last = lastCheck?.getTime();

          if (now - last > ONE_WEEK_MS) {
            await checkForUpdate();
            return;
          } else {
            // console.info(
            //   "[UpdateCheck] Checking for updates skipped. The last check for updates was in less that one week."
            // );
          }
        }
      } catch (error: any) {
        console.warn(
          "[UpdateCheck] Something went wrong while checking for updates: ",
          error.message
        );
      }
    };

    handleCheck();
  }, [lastCheck, checkForUpdate, loadingLastCheck, pathname]);

  return {
    checkForUpdate,
    confirmUpdate,
    checkingForUpdates,
    lastCheck,
    updateInfo,
  };
}
