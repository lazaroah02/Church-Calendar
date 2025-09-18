import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export function MyNavigationBar({
  buttonsStyle = "light",
}: {
  buttonsStyle?: NavigationBar.NavigationBarButtonStyle;
}) {
  useEffect(() => {
    NavigationBar.setButtonStyleAsync(buttonsStyle);
    return () => {
      NavigationBar.setButtonStyleAsync("light");
    };
  }, []);
  return null;
}
