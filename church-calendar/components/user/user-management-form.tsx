import { useState } from "react";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { UserManagementFormErrors } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text, Pressable } from "react-native";
import { Button } from "../Button";
import { CustomInput } from "../form/custom-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getImageUri } from "@/lib/get-image-uri";
import FormErrorBanner from "../form/form-banner-error";
import { pickImage } from "@/lib/pick-image";

export function UserManagementForm({
  user,
  onCancel = () => null,
  onSuccess = () => null,
}: {
  user: UserInfo | undefined;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const styles = useThemeStyles(userManagementForm);
  const inputColor = "#EBEBEB";

  const [profileImage, setProfileImage] = useState(
    user?.profile_img ? getImageUri(user?.profile_img) : null
  );
  const [errors, setErrors] = useState<UserManagementFormErrors | null>(null);

  const [formValues, setFormValues] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    description: user?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    
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
        <Pressable
          style={styles.profilePictureContainer}
          onPress={() =>
            pickImage({
              aspect: [1, 1],
              setImage: (img) => setProfileImage(img),
            })
          }
        >
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

        {errors && (
          <FormErrorBanner
            style={{ marginTop: 10, marginBottom: 0 }}
            message={
              errors.full_name ||
              errors.phone_number ||
              errors.email ||
              errors.description ||
              "Ocurrió un error inesperado."
            }
          />
        )}

        {/* Full Name */}
        <Text style={styles.groupLabel}>Nombre Completo</Text>
        <CustomInput
          error={errors?.full_name}
          textContentType="name"
          value={formValues.full_name}
          onChangeText={(value) => handleChange("full_name", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Phone */}
        <Text style={styles.groupLabel}>Teléfono:</Text>
        <CustomInput
          error={errors?.phone_number}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          value={formValues.phone_number}
          onChangeText={(value) => handleChange("phone_number", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Email */}
        <Text style={styles.groupLabel}>Correo:</Text>
        <CustomInput
          error={errors?.email}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={formValues.email}
          onChangeText={(value) => handleChange("email", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Description */}
        <Text style={styles.groupLabel}>Descripción:</Text>
        <CustomInput
          error={null}
          value={formValues.description}
          onChangeText={(value) => handleChange("description", value)}
          inputStyle={{ backgroundColor: inputColor, height: "auto" }}
          containerStyle={{ height: "auto", width: "100%" }}
          scrollEnabled
          multiline
        />
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Button text="Cancelar" onPress={onCancel} style={{ width: "40%" }} />
        <Button
          text="Enviar"
          loadingText="Enviando"
          loading={loading}
          onPress={() => handleSubmit()}
          variant="submit"
          style={{ width: "50%" }}
        />
      </View>
    </>
  );
}

const userManagementForm = (theme: AppTheme) => {
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
