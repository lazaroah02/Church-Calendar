import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SessionProvider } from "@/contexts/authContext";
import { useSession } from "@/hooks/auth/useSession";
import SplashScreenController from "./splash";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { queryClient, persister } from "@/lib/query-client";

export default function Root() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    persister.restoreClient(queryClient).finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return <SplashScreenController />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SplashScreenController />
        <RootLayout />
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    InterVariable: require("../assets/fonts/Inter-VariableFont.ttf"),
    LexendBold: require("../assets/fonts/Lexend-Bold.ttf"),
  });
  const { session } = useSession();

  if (!loaded) {
    // Async font loading only occurs in development.
    return <SplashScreenController />
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Stack>
          <Stack.Protected guard={!session}>
            <Stack.Screen
              name="welcome"
              options={{ headerShown: false, animation: "fade" }}
            />
          </Stack.Protected>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: "fade" }}
          />
          <Stack.Screen
            name="sign-in"
            options={{ headerShown: false, animation: "fade" }}
          />
          <Stack.Screen
            name="register"
            options={{ headerShown: false, animation: "fade" }}
          />
          <Stack.Screen
            name="event/details"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={"auto"} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
