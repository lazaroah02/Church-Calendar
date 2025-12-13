import { Text as RNText, TextProps } from "react-native";

export function MyCustomText(props: TextProps) {
  return (
    <RNText
      {...props}
      allowFontScaling={false}
    />
  );
}