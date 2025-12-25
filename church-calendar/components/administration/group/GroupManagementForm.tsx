import { useState } from "react";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Pressable } from "react-native";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/form/custom-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getImageUri } from "@/lib/get-image-uri";
import FormErrorBanner from "@/components/form/form-banner-error";
import { pickImage } from "@/lib/pick-image";
import { Group } from "@/types/group";
import { useManageGroups } from "@/hooks/groups/useManageGroups";
import ColorPicker from "react-native-wheel-color-picker";
import { MyCustomText } from "@/components/MyCustomText";

export function GroupManagementForm({
  group,
  onCancel = () => null,
  onSuccess = () => null,
  action = "update",
}: {
  group?: Group | undefined | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  action: "update" | "create";
}) {
  const styles = useThemeStyles(userManagementForm);
  const inputColor = "#EBEBEB";

  const [profileImage, setProfileImage] = useState(
    group?.img ? getImageUri(group?.img) : null
  );

  const [groupColor, setGroupColor] = useState(group?.color || "ffe066");

  const [formValues, setFormValues] = useState({
    name: group?.name || "",
    description: group?.description || "",
  });

  const {
    handleUpdateGroup,
    isUpdatingGroup,
    errorUpdatingGroup,
    handleCreateGroup,
    isCreatingGroup,
    errorCreatingGroup,
  } = useManageGroups();

  const loading = isUpdatingGroup || isCreatingGroup;
  const errors = errorUpdatingGroup || errorCreatingGroup;

  const handleChange = (
    key: keyof typeof formValues,
    value: string | number[] | boolean
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (action === "update") {
      handleUpdateGroup({
        groupId: group?.id,
        data: { ...formValues, img: profileImage, color: groupColor },
      });
    } else {
      handleCreateGroup({
        data: { ...formValues, img: profileImage, color: groupColor },
      });
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
        {/*Warning*/}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            paddingRight: 10,
          }}
        >
          <Ionicons name="warning-outline" size={30} />
          <MyCustomText style={[styles.groupLabel, { marginTop: 0, width:"90%" }]}>
            Los cambios realizados pueden tardar unos minutos en reflejarse en
            los datos de los eventos.
          </MyCustomText>
        </View>
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
            <Ionicons name="image-outline" size={100} color="#fff" />
          )}
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        </Pressable>

        {errors && (
          <FormErrorBanner
            style={{ marginTop: 10, marginBottom: 0 }}
            message={
              errors.name ||
              errors.description ||
              errors.color ||
              errors.general ||
              "Ocurrió un error inesperado. Revisa tu conexión a internet."
            }
          />
        )}

        {/* Name */}
        <MyCustomText style={styles.groupLabel}>Nombre</MyCustomText>
        <CustomInput
          error={errors?.name}
          textContentType="name"
          value={formValues.name}
          onChangeText={(value) => handleChange("name", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Description */}
        <MyCustomText style={styles.groupLabel}>Descripción:</MyCustomText>
        <CustomInput
          error={null}
          value={formValues.description}
          onChangeText={(value) => handleChange("description", value)}
          inputStyle={{ backgroundColor: inputColor, height: "auto" }}
          containerStyle={{ height: "auto", width: "100%" }}
          scrollEnabled
          multiline
        />

        {/* Color */}
        <MyCustomText style={styles.groupLabel}>Color</MyCustomText>
        <View style={{ flex: 1, paddingBottom: 30 }}>
          <ColorPicker
            color={groupColor}
            onColorChange={setGroupColor}
            onColorChangeComplete={setGroupColor}
            sliderSize={30}
            thumbSize={40}
          />
        </View>
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
