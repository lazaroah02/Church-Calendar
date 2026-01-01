import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export function useMyNavigationBar({
  buttonsStyle = "light",
  backgroundColor = "#6a7073ff",
}: {
  buttonsStyle?: NavigationBar.NavigationBarButtonStyle;
  backgroundColor?: string;
}) {
  useFocusEffect(
    useCallback(() => {
      NavigationBar.setButtonStyleAsync(buttonsStyle);
      NavigationBar.setBackgroundColorAsync(backgroundColor);
    }, [backgroundColor, buttonsStyle])
  );

  return null;
}
