import { useState } from "react";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { UserInfo } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Pressable } from "react-native";
import { Button } from "../Button";
import { CustomInput } from "../form/custom-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getImageUri } from "@/lib/get-image-uri";
import FormErrorBanner from "../form/form-banner-error";
import { pickImage } from "@/lib/pick-image";
import { CheckBox } from "../form/checkbox";
import { ChurchGroupsPicker } from "../form/church-groups-picker";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { MyCustomText } from "../MyCustomText";

export function UserManagementForm({
  user,
  onCancel = () => null,
  onSuccess = () => null,
  action = "update",
}: {
  user?: UserInfo | undefined | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  action: "update" | "create";
}) {
  const styles = useThemeStyles(userManagementForm);
  const inputColor = "#EBEBEB";

  const [profileImage, setProfileImage] = useState(
    user?.profile_img ? getImageUri(user?.profile_img) : null
  );

  // password only for user creation
  const [password, setPassword] = useState("");

  const [formValues, setFormValues] = useState({
    full_name: user?.full_name ?? "",
    phone_number: user?.phone_number ?? "",
    email: user?.email ?? "",
    description: user?.description ?? "",
    is_staff: user?.is_staff ?? false,
    is_active: user?.is_active ?? true,
    member_groups: user?.member_groups ?? [],
  });

  const {
    handleUpdateUser,
    isUpdatingUser,
    errorUpdatingUser,
    handleCreateUser,
    isCreatingUser,
    errorCreatingUser,
  } = useManageUsers({});

  const loading = isCreatingUser ?? isUpdatingUser;
  const errors = errorCreatingUser ?? errorUpdatingUser

  const handleChange = (
    key: keyof typeof formValues,
    value: string | number[] | boolean
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (action === "update") {
      handleUpdateUser({
        userId: user?.id,
        data: { ...formValues, profile_img: profileImage },
      });
    } else {
      handleCreateUser({
        data: { ...formValues, profile_img: profileImage },
        password: password,
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
              errors.full_name ??
              errors.password ??
              errors.phone_number ??
              errors.email ??
              errors.description ??
              "Ocurrió un error inesperado. Revisa tu conexión a internet."
            }
          />
        )}

        {/* Full Name */}
        <MyCustomText style={styles.groupLabel}>Nombre Completo</MyCustomText>
        <CustomInput
          error={errors?.full_name}
          textContentType="name"
          value={formValues.full_name}
          onChangeText={(value) => handleChange("full_name", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/* Password */}
        {action === "create" && (
          <>
            <MyCustomText style={styles.groupLabel}>Contraseña</MyCustomText>
            <CustomInput
              error={errors?.password}
              textContentType="password"
              value={password}
              onChangeText={(value) => setPassword(value)}
              inputStyle={{ backgroundColor: inputColor }}
              containerStyle={{ width: "100%" }}
              isPassword={true}
            />
          </>
        )}

        {/* Phone */}
        <MyCustomText style={styles.groupLabel}>Teléfono:</MyCustomText>
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
        <MyCustomText style={styles.groupLabel}>Correo:</MyCustomText>
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

        {/*Groups*/}
        <MyCustomText style={styles.groupLabel}>Grupos a los que pertenece:</MyCustomText>
        <ChurchGroupsPicker
          key={formValues?.member_groups?.map((g) => g).join(",") ?? "empty"}
          placeholder="Seleccionar"
          defaultSelectedGroups={formValues.member_groups}
          excluded_groups={[1, "Todos"]}
          onChange={(selectedGroups) =>
            handleChange("member_groups", selectedGroups)
          }
        />

        {/*Access and Permissions*/}
        <MyCustomText style={styles.groupLabel}>Acceso y Permisos:</MyCustomText>
        <CheckBox
          label="Tiene acceso a la aplicación"
          checked={formValues.is_active}
          onCheck={(checked) => handleChange("is_active", checked)}
        />
        <CheckBox
          label="Es Administrador"
          checked={formValues.is_staff}
          onCheck={(checked) => handleChange("is_staff", checked)}
        />
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Button text="Cancelar" onPress={onCancel} style={{ width: "40%" }} textStyle={{fontWeight:900}}/>
        <Button
          text="Enviar"
          loadingText="Enviando"
          loading={loading}
          onPress={() => handleSubmit()}
          variant="submit"
          style={{ width: "50%" }}
          textStyle={{fontWeight:900}}
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
      backgroundColor: "#6a7073ff",
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
      fontSize: theme.fontSizes.md,
      opacity: 0.8,
    },
  };
};
