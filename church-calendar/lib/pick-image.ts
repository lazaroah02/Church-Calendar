import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export interface PickImageProps {
  aspect?: undefined | [number, number];
  setImage: (img: string) => void;
}

export const pickImage = async ({
  aspect = undefined,
  setImage,
}: PickImageProps) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permiso denegado", "Necesitas dar acceso a tu galería.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: aspect,
    quality: 0.8,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};
