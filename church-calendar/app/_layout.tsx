import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SessionProvider, useSession } from '@/contexts/authContext';
import { SplashScreenController } from './splash';
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from '@/hooks/useColorScheme';

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootLayout />
    </SessionProvider>
  );
}


function RootLayout() {
  const [loaded] = useFonts({
    InterRegular: require('../assets/fonts/Inter-Regular.ttf'),
    InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
    LexendBold: require('../assets/fonts/Lexend-Bold.ttf'),
  });
  const { session } = useSession();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }}/>
        </Stack.Protected>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={'auto'} />
    </SafeAreaProvider>
  );
}
