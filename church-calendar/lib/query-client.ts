import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  Persister,
  persistQueryClient,
} from "@tanstack/react-query-persist-client";
import { Platform } from "react-native";

/**
 * 1️⃣ Initialize the QueryClient
 *
 * We create a new QueryClient instance with default options:
 * - gcTime: Garbage collection time (how long data stays in cache when not observed)
 * - staleTime: Time until data becomes stale
 * - retry: Number of retry attempts for failed queries
 */

export const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: DEFAULT_STALE_TIME,
      retry: process.env.NODE_ENV === "development" ? 2 : 0,
      networkMode: "offlineFirst",
    },
  },
});

/**
 * 2️⃣ Create AsyncStorage Persister
 *
 * This persister handles storing and restoring React Query cache
 * from AsyncStorage for offline-first capabilities.
 */

const isWeb = Platform.OS === "web";

export const asyncStoragePersister = !isWeb
  ? createAsyncStoragePersister({
      storage: AsyncStorage,
    })
  : null;

export const persister = asyncStoragePersister as Persister & {
  restoreClient: (client: typeof queryClient) => Promise<void>;
};

/**
 * 3️⃣ Persist QueryClient Cache
 *
 * Automatically restores cached queries from AsyncStorage when
 * the app starts, and keeps them for a maximum of 7 days.
 */
if (!isWeb) {
  persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
