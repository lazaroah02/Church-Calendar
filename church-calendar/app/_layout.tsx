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
import { AppThemeProvider } from "@/contexts/theme-context";
import { queryClient, persister } from "@/lib/query-client";
import { CalendarContextProvider } from "@/contexts/calendar-context/calendarContext";
import { ToastProvider } from "expo-toast";

export default function Root() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    persister.restoreClient(queryClient).finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return <SplashScreenController />;
  }

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <CalendarContextProvider>
            <AppThemeProvider>
              <SplashScreenController />
              <RootLayout />
            </AppThemeProvider>
          </CalendarContextProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ToastProvider>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    InterVariable: require("../assets/fonts/Inter-VariableFont.ttf"),
    LexendBold: require("../assets/fonts/Lexend-Bold.ttf"),
  });
  const { session, isLoading } = useSession();

  if (!loaded || isLoading) {
    // Async font loading only occurs in development.
    return <SplashScreenController />;
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="event/create"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="event/edit"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="user/profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="user/detail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style={"auto"} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
