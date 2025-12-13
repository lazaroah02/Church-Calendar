import { useState } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { UserProfileFormErrors } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Pressable } from "react-native";
import { Button } from "../Button";
import { CustomInput } from "../form/custom-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { updateUserProfile } from "@/services/user/update-user-profile";
import { getImageUri } from "@/lib/get-image-uri";
import FormErrorBanner from "../form/form-banner-error";
import { pickImage } from "@/lib/pick-image";
import { MyCustomText } from "../MyCustomText";

export function UserProfileForm({
  user,
  onCancel = () => null,
  onSuccess = () => null,
}: {
  user: UserInfo | undefined;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const styles = useThemeStyles(userForm);
  const inputColor = "#EBEBEB";
  const { session, updateSession } = useSession();

  const [profileImage, setProfileImage] = useState(
    user?.profile_img ? getImageUri(user?.profile_img) : null
  );
  const [errors, setErrors] = useState<UserProfileFormErrors | null>(null);

  const [formValues, setFormValues] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    description: user?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleTextChange = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    updateUserProfile({
      token: session?.token,
      values: { profile_img: profileImage, ...formValues },
    })
      .then((data) => {
        updateSession({ token: session?.token, userInfo: data });
        onSuccess();
      })
      .catch((err) => setErrors(JSON.parse(err.message) as UserProfileFormErrors))
      .finally(() => setLoading(false));
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
              errors.general ||
              "Ocurrió un error inesperado."
            }
          />
        )}

        {/* Full Name */}
        <MyCustomText style={styles.label}>Nombre Completo</MyCustomText>
        <CustomInput
          error={errors?.full_name}
          textContentType="name"
          value={formValues.full_name}
          onChangeText={(value) => handleTextChange("full_name", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Phone */}
        <MyCustomText style={styles.label}>Teléfono:</MyCustomText>
        <CustomInput
          error={errors?.phone_number}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          value={formValues.phone_number}
          onChangeText={(value) => handleTextChange("phone_number", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Email */}
        <MyCustomText style={styles.label}>Correo:</MyCustomText>
        <CustomInput
          error={errors?.email}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={formValues.email}
          onChangeText={(value) => handleTextChange("email", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Description */}
        <MyCustomText style={styles.label}>Descripción:</MyCustomText>
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
    label: {
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
