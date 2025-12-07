import { CustomInput } from "@/components/form/custom-input";
import { getImageUri } from "@/lib/get-image-uri";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CheckBox } from "@/components/form/checkbox";
import { Button } from "@/components/Button";
import { pickImage } from "@/lib/pick-image";
import type { EventFormType, Event } from "@/types/event";
import { DateTimePickerGroup } from "@/components/form/date-time-picker-group";
import { ChurchGroupsPicker } from "@/components/form/church-groups-picker";
import FormErrorBanner from "@/components/form/form-banner-error";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

const inputColor = "#EBEBEB";

export function EventForm({
  event = null,
  reset = () => null,
  errors = null,
  isPending = false,
  handleSubmit = (values) => null,
  onCancel = () => null,
}: {
  event?: Event | null;
  reset?: () => void;
  errors?: Record<string, string | null> | null;
  isPending: boolean;
  handleSubmit: (values: EventFormType) => void;
  onCancel?: () => void;
}) {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const styles = useThemeStyles(EventFormStyles);
  const [showDateTimePickers, setShowDateTimePickers] = useState<{
    start_time: false | "date" | "time";
    end_time: false | "date" | "time";
  }>({ start_time: false, end_time: false });
  
  const [formValues, setFormValues] = useState({
    title: event?.title || "",
    location: event?.location || "",
    description: event?.description || "",
    start_time: event && event.start_time ? new Date(event.start_time): new Date(),
    end_time: event && event.end_time ? new Date(event.end_time): new Date(),
    groups: event?.groups || [],
    is_canceled: event?.is_canceled || false,
    visible: event?.visible || true,
    open_to_reservations: event?.open_to_reservations || false,
    reservations_limit: event?.reservations_limit || null,
  });

  const [eventImage, setEventImage] = useState(
    event?.img ? getImageUri(event?.img) : null
  );

  const handleFieldChange = (
    key: keyof typeof formValues,
    value: string | boolean | Date | number[] | undefined | number | null
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    reset();
  };

  useEffect(() => {
    if (errors) {
      scrollViewRef.current?.scrollToPosition(0, 0, true);
    }
  }, [errors]);
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={150}
        ref={scrollViewRef}
      >
        {/* Picture */}
        <Pressable
          style={styles.pictureContainer}
          onPress={() => pickImage({ setImage: (img) => setEventImage(img) })}
        >
          {eventImage ? (
            <Image style={styles.picture} source={{ uri: eventImage }} />
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
        {errors && (
          <FormErrorBanner
            message={
              Object.values(errors).find((err) => Boolean(err)) ||
              "Ocurrió un error inesperado."
            }
            style={{ marginTop: 10, marginBottom: 0 }}
          />
        )}

        {/*Title*/}
        <Text style={styles.label}>Título:</Text>
        <CustomInput
          error={errors?.title}
          value={formValues.title}
          onChangeText={(value) => handleFieldChange("title", value)}
          inputStyle={{ backgroundColor: inputColor }}
          containerStyle={{ width: "100%" }}
        />

        {/*Location*/}
        <Text style={styles.label}>Lugar:</Text>
        <CustomInput
          error={errors?.location}
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

        {/* START DATE */}
        <Text style={styles.label}>Inicio:</Text>
        <DateTimePickerGroup
          value={formValues.start_time}
          handleChange={(date) => handleFieldChange("start_time", date)}
          showTimePicker={showDateTimePickers.start_time === "time"}
          showDatePicker={showDateTimePickers.start_time === "date"}
          handleShowDatePicker={() =>
            setShowDateTimePickers({ start_time: "date", end_time: false })
          }
          handleShowTimePicker={() =>
            setShowDateTimePickers({ start_time: "time", end_time: false })
          }
          handleHideDatePicker={() =>
            setShowDateTimePickers({
              start_time: false,
              end_time: false,
            })
          }
          handleHideTimePicker={() =>
            setShowDateTimePickers({
              start_time: false,
              end_time: false,
            })
          }
        />

        {/* END DATE */}
        <Text style={styles.label}>Fin:</Text>
        <DateTimePickerGroup
          error={errors?.end_time}
          value={formValues.end_time}
          handleChange={(date) => handleFieldChange("end_time", date)}
          showTimePicker={showDateTimePickers.end_time === "time"}
          showDatePicker={showDateTimePickers.end_time === "date"}
          handleShowDatePicker={() =>
            setShowDateTimePickers({ end_time: "date", start_time: false })
          }
          handleShowTimePicker={() =>
            setShowDateTimePickers({ end_time: "time", start_time: false })
          }
          handleHideDatePicker={() =>
            setShowDateTimePickers({
              start_time: false,
              end_time: false,
            })
          }
          handleHideTimePicker={() =>
            setShowDateTimePickers({
              start_time: false,
              end_time: false,
            })
          }
        />

        {/*Groups*/}
        <Text style={styles.label}>Dirigido a:</Text>
        <ChurchGroupsPicker
          onChange={(selectedGroups) =>
            handleFieldChange("groups", selectedGroups)
          }
          placeholder="Seleccionar"
          defaultSelectedGroups={event?.groups}
        />

        {/*State*/}
        <Text style={styles.label}>Estado:</Text>
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
        <CheckBox
          label="Abierto a reservaciones"
          checked={formValues.open_to_reservations}
          onCheck={(checked) => {
            scrollViewRef.current?.scrollToEnd(true);
            handleFieldChange("open_to_reservations", checked);
          }}
        />

        {/*Reservations Limit*/}
        {formValues.open_to_reservations && (
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 20 }}
            >
              <Text style={styles.label}>Límite de Reservas:</Text>
              <CheckBox
                label="Sin límite"
                checked={formValues.reservations_limit === null}
                onCheck={(checked) => {
                  if (checked) {
                    handleFieldChange("reservations_limit", null);
                  }else{
                    handleFieldChange("reservations_limit", 100);
                  }
                }}
              />
            </View>
            <CustomInput
              value={formValues.reservations_limit?.toString() || ""}
              error={errors?.reservations_limit}
              placeholder="Número máximo de reservaciones"
              inputStyle={{ backgroundColor: inputColor, height: "auto" }}
              containerStyle={{ height: "auto", width: "100%" }}
              keyboardType="number-pad"
              onChangeText={(value) => {
                if (isNaN(parseInt(value)) && value !== "") {
                  return;
                }
                handleFieldChange(
                  "reservations_limit",
                  value ? parseInt(value) : null
                );
              }}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Button
          text="Cancelar"
          disabled={isPending}
          onPress={onCancel}
          style={{ width: "40%" }}
        />
        <Button
          text="Enviar"
          loadingText="Enviando"
          loading={isPending}
          disabled={isPending}
          onPress={() => handleSubmit({ img: eventImage, ...formValues })}
          variant="submit"
          style={{ width: "50%" }}
        />
      </View>
    </>
  );
}

const EventFormStyles = (theme: AppTheme) => {
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
