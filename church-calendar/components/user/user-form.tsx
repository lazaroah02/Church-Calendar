import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "@/api-endpoints";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text, Pressable, Alert } from "react-native";
import { Button } from "../Button";
import { CustomInput } from "../form/custom-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { updateUserProfile } from "@/services/user/update-user-profile";

export function UserForm({
  user,
  onCancel = () => null,
}: {
  user: UserInfo;
  onCancel?: () => void;
}) {
  const styles = useThemeStyles(userForm);
  const inputColor = "#EBEBEB";
  const { session } = useSession();

  const [profileImage, setProfileImage] = useState(
    user.profile_img ? `${BASE_URL}${user.profile_img}` : null
  );

  const [formValues, setFormValues] = useState({
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    email: user.email || "",
    description: user.description || "",
  });

  const handleTextChange = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    updateUserProfile({
      token: session?.token,
      values: { profile_img: profileImage, ...formValues },
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitas dar acceso a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={100}
      >
        {/* Profile Picture */}
        <Pressable style={styles.profilePictureContainer} onPress={pickImage}>
          {profileImage ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: profileImage }}
            />
          ) : (
            <Ionicons name="person-outline" size={100} color="#fff" />
          )}
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        </Pressable>

        {/* Full Name */}
        <Text style={styles.groupLabel}>Nombre Completo</Text>
        <CustomInput
          error={null}
          textContentType="name"
          value={formValues.full_name}
          onChangeText={(value) => handleTextChange("full_name", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Phone */}
        <Text style={styles.groupLabel}>Teléfono:</Text>
        <CustomInput
          error={null}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          value={formValues.phone_number}
          onChangeText={(value) => handleTextChange("phone_number", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Email */}
        <Text style={styles.groupLabel}>Correo:</Text>
        <CustomInput
          error={null}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={formValues.email}
          onChangeText={(value) => handleTextChange("email", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Description */}
        <Text style={styles.groupLabel}>Descripción:</Text>
        <CustomInput
          error={null}
          value={formValues.description}
          onChangeText={(value) => handleTextChange("description", value)}
          inputStyle={{ backgroundColor: inputColor, height: "auto" }}
          containerStyle={{ height: "auto", width: "100%" }}
          scrollEnabled
          multiline
        />
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Button
          text="Cancelar"
          onPress={onCancel}
          style={{ width: "40%" }}
        />
        <Button
          text="Enviar"
          onPress={() => handleSubmit()}
          variant="submit"
          style={{ width: "50%" }}
        />
      </View>
    </>
  );
}

const userForm = (theme: AppTheme) => {
  return {
    scrollView: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: "#fff",
      flexDirection: "column",
    },
    profilePictureContainer: {
      backgroundColor: "#37C6FF",
      width: 200,
      height: 200,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      position: "relative",
      overflow: "hidden",
    },
    profilePicture: {
      width: "100%",
      height: "100%",
      borderRadius: 100,
    },
    cameraIconContainer: {
      position: "absolute",
      bottom: 10,
      left: "50%",
      transform: [{ translateX: "-50%" }],
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 20,
      padding: 6,
    },
    groupLabel: {
      fontWeight: 500,
      marginBottom: 5,
      marginTop: 20,
      color: "#000",
      fontFamily: "LexendBold",
      fontSize: theme.fontSizes.lg,
      opacity: 0.8,
    },
  };
};
