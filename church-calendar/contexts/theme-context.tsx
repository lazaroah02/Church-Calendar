import React, { createContext, useContext, PropsWithChildren } from "react";
import { ThemeProvider as StyledProvider } from "styled-components/native";
import { normalTheme, largeTheme, AppTheme } from "@/theme";
import { useStorageState } from "@/hooks/useStorageState";
import SplashScreenController from "@/app/splash";
import { PixelRatio } from "react-native";

type ThemeType = "normal" | "large";

interface ThemeContextType {
  themeName: ThemeType;
  setThemeName: (t: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const pixelRatioBreakPoint = 1.2;

export function AppThemeProvider({ children }: PropsWithChildren) {
  const defaultTheme: ThemeType =
    PixelRatio.getFontScale() > pixelRatioBreakPoint ? "large" : "normal";

  const [[isLoading, themeName], setThemeName] = useStorageState(
    "app-theme",
    defaultTheme
  );

  // Mientras carga, podemos devolver null o un loader
  if (isLoading) {
    return <SplashScreenController />;
  }

  const theme: AppTheme = themeName === "large" ? largeTheme : normalTheme;

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
