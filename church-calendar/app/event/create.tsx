import { CustomInput } from "@/components/form/custom-input";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { useSession } from "@/hooks/auth/useSession";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSearchParams } from "expo-router/build/hooks";
import { CheckBox } from "@/components/form/checkbox";
import { Button } from "@/components/Button";
import { router } from "expo-router";
import { pickImage } from "@/lib/pick-image";
import type { Event } from "@/types/event";

export default function CreateEvent() {
  const { session } = useSession();
  const styles = useThemeStyles(createEventFormStyles);
  const inputColor = "#EBEBEB";

  const searchParams = useSearchParams();
  const event = searchParams.get("event") as string | undefined;
  const parsedEvent: Event | null = event ? JSON.parse(event) : null;

  const [formValues, setFormValues] = useState({
    title: "",
    location: "",
    description: "",
    start_time: "",
    end_time: "",
    groups: [],
    is_canceled: false,
    visible: true,
    open_to_reservations: false,
  });

  const [profileImage, setProfileImage] = useState(
    parsedEvent?.img ? getImageUri(parsedEvent?.img) : null
  );

  const handleFieldChange = (
    key: keyof typeof formValues,
    value: string | boolean
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={100}
      >
        {/* Picture */}
        <Pressable
          style={styles.pictureContainer}
          onPress={() => pickImage({ setImage: (img) => setProfileImage(img) })}
        >
          {profileImage ? (
            <Image style={styles.picture} source={{ uri: profileImage }} />
          ) : (
            <Ionicons
              name="camera-outline"
              size={100}
              color="rgba(0, 0, 0, 0.5)"
            />
          )}
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        </Pressable>

        {/*Title*/}
        <Text style={styles.label}>Título:</Text>
        <CustomInput
          error={null}
          value={formValues.title}
          onChangeText={(value) => handleFieldChange("title", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/*Location*/}
        <Text style={styles.label}>Lugar:</Text>
        <CustomInput
          error={null}
          value={formValues.location}
          onChangeText={(value) => handleFieldChange("location", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/*Description*/}
        <Text style={styles.label}>Descripción:</Text>
        <CustomInput
          error={null}
          value={formValues.description}
          onChangeText={(value) => handleFieldChange("description", value)}
          inputStyle={{ backgroundColor: inputColor, height: "auto" }}
          containerStyle={{ height: "auto", width: "100%" }}
          scrollEnabled
          multiline
        />

        {/*State*/}
        <Text style={styles.label}>Estado:</Text>
        <CheckBox
          label="Abierto a reservaciones"
          checked={formValues.open_to_reservations}
          onCheck={(checked) =>
            handleFieldChange("open_to_reservations", checked)
          }
        />
        <CheckBox
          label="Cancelado"
          checked={formValues.is_canceled}
          onCheck={(checked) => handleFieldChange("is_canceled", checked)}
        />
        <CheckBox
          label="Visible"
          checked={formValues.visible}
          onCheck={(checked) => handleFieldChange("visible", checked)}
        />
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Button
          text="Cancelar"
          onPress={() => router.back()}
          style={{ width: "40%" }}
        />
        <Button
          text="Enviar"
          loadingText="Enviando"
          loading={false}
          onPress={() => null}
          variant="submit"
          style={{ width: "50%" }}
        />
      </View>
    </SafeAreaView>
  );
}

const createEventFormStyles = (theme: AppTheme) => {
  return {
    pageContainer: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollView: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: "#fff",
      flexDirection: "column",
    },
    pictureContainer: {
      backgroundColor: "#e0e0e0",
      width: "100%",
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      position: "relative",
      overflow: "hidden",
      borderRadius: 10,
    },
    picture: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      objectFit: "contain",
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
