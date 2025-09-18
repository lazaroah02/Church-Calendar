import React, { createContext, useContext, PropsWithChildren } from "react";
import { ThemeProvider as StyledProvider } from "styled-components/native";
import { normalTheme, largeTheme, AppTheme } from "@/theme";
import { useStorageState } from "@/hooks/useStorageState";
import SplashScreenController from "@/app/splash";

type ThemeType = "normal" | "large";

interface ThemeContextType {
  themeName: ThemeType;
  setThemeName: (t: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  // Usamos el hook que maneja AsyncStorage
  const [[isLoading, themeName], setThemeName] = useStorageState(
    "app-theme", // clave en AsyncStorage
  );

  // Mientras carga, podemos devolver null o un loader
  if (isLoading) {
    return <SplashScreenController/>;
  }

  const theme: AppTheme = themeName === "normal" ? normalTheme : largeTheme;

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <StyledProvider theme={theme}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used inside AppThemeProvider");
  return ctx;
}
