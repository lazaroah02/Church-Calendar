import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Pressable, View } from "react-native";
import { MyCustomText } from "../MyCustomText";

interface DateTimePickerGroupProps {
  showDatePicker: boolean;
  showTimePicker: boolean;
  handleShowDatePicker: () => void;
  handleShowTimePicker: () => void;
  handleHideDatePicker: () => void;
  handleHideTimePicker: () => void;
  value: Date;
  handleChange: (date: Date | undefined) => void;
  error?: null | boolean | string;
}

const inputColor = "#EBEBEB";

export function DateTimePickerGroup({
  showDatePicker,
  showTimePicker,
  value,
  error,
  handleShowDatePicker,
  handleShowTimePicker,
  handleHideDatePicker,
  handleHideTimePicker,
  handleChange,
}: DateTimePickerGroupProps) {
  const styles = useThemeStyles(DateTimePickerGroupStyles);
  return (
    <>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flexGrow: 1 }}>
          <MyCustomText style={styles.label}>Fecha</MyCustomText>
          <Pressable onPress={handleShowDatePicker}>
            <MyCustomText
              style={[styles.dateTimeInputPicker, error && styles.inputError]}
            >
              {value.toLocaleDateString("es-ES")}
            </MyCustomText>
            {error && (
              <Ionicons
                name="alert-circle"
                size={18}
                color="#b91c1c"
                style={[styles.errorIcon]}
              />
            )}
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={(
                event: DateTimePickerEvent,
                date: Date | undefined
              ) => {
                handleHideDatePicker();
                if (date) {
                  const updated = new Date(value);
                  updated.setFullYear(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                  );
                  handleChange(updated);
                }
              }}
            />
          )}
        </View>
        <View style={{ width: "50%" }}>
          <MyCustomText style={styles.label}>Hora</MyCustomText>
          <Pressable onPress={handleShowTimePicker}>
            <MyCustomText
              style={[styles.dateTimeInputPicker, error && styles.inputError]}
            >
              {value.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </MyCustomText>
            {error && (
              <Ionicons
                name="alert-circle"
                size={18}
                color="#b91c1c"
                style={[styles.errorIcon]}
              />
            )}
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(
                event: DateTimePickerEvent,
                date: Date | undefined
              ) => {
                handleHideTimePicker();
                if (event.type === "dismissed") {
                  return;
                }
                if (date) {
                  const updated = new Date(
                    value.getFullYear(),
                    value.getMonth(),
                    value.getDate(),
                    date.getHours(),
                    date.getMinutes()
                  );
                  handleChange(updated);
                }
              }}
            />
          )}
        </View>
      </View>
    </>
  );
}

const DateTimePickerGroupStyles = (theme: AppTheme) => {
  return {
    label: {
      fontWeight: 500,
      color: "#000",
      fontFamily: "InterVariable",
      fontSize: theme.fontSizes.lg,
      opacity: 0.8,
    },
    dateTimeInputPicker: {
      position: "relative",
      backgroundColor: inputColor,
      width: "100%",
      height: 45,
      borderRadius: 10,
      paddingHorizontal: 20,
      marginVertical: 10,
      color: "#000",
      fontFamily: "InterVariable",
      fontSize: theme.fontSizes.md,
      fontWeight: "400",
      verticalAlign: "middle",
    },
    errorIcon: {
      position: "absolute",
      right: 5,
      top: "50%",
      transform: [{ translateY: -9 }],
    },

    inputError: {
      borderWidth: 2,
      borderColor: "rgb(215, 0, 75)",
    },
  };
};
