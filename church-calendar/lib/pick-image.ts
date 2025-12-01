import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

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
    quality: 1,
  });

  if (result.canceled) return;

  const originalUri = result.assets[0].uri;

  // Optimize before setting
  const optimizedUri = await optimizeImage(originalUri);

  setImage(optimizedUri);
};

const SIZE_LIMIT = 300 * 1024; // 300 KB
export const optimizeImage = async (uri: string): Promise<string> => {
  try {
    // Get image info (size)
    const info = await FileSystem.getInfoAsync(uri);

    // If small, skip optimization
    if (info.size && info.size < SIZE_LIMIT) {
      console.log("Skipping optimization — image already small.");
      return uri;
    }

    console.log("Optimizing image...");

    // Resize + compress + convert to WebP
    const optimized = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }], // Only affects large images
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.WEBP,
      }
    );

    return optimized.uri;
  } catch (err) {
    console.error("Image optimization failed:", err);
    return uri; // Fallback: return original image
  }
};
