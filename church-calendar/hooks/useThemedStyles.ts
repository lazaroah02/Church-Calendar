import { useTheme } from "styled-components/native";
import { useMemo } from "react";
import { StyleSheet, StyleProp } from "react-native";
import type { AppTheme } from "@/theme";

export function useThemeStyles<T extends StyleProp<any>>(
  factory: (theme: AppTheme) => T
) {
  const theme = useTheme() as AppTheme;

  return useMemo(() => StyleSheet.create(factory(theme)), [theme, factory]);
}
