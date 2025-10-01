import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Pressable, View, Text } from "react-native";

interface DateTimePickerGroupProps {
  showDatePicker: boolean;
  showTimePicker: boolean;
  handleShowDatePicker: () => void;
  handleShowTimePicker: () => void;
  handleHideDatePicker: () => void;
  handleHideTimePicker: () => void;
  value: Date;
  handleChange: (date: Date | undefined) => void;
}

const inputColor = "#EBEBEB";

export function DateTimePickerGroup({
  showDatePicker,
  showTimePicker,
  value,
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
          <Text style={styles.label}>Fecha</Text>
          <Pressable onPress={handleShowDatePicker}>
            <Text style={styles.dateTimeInputPicker}>
              {value?.toLocaleDateString("es-ES")}
            </Text>
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
          <Text style={styles.label}>Hora</Text>
          <Pressable onPress={handleShowTimePicker}>
            <Text style={styles.dateTimeInputPicker}>
              {value.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
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
                if (date) {
                  const updated = new Date(value);
                  updated.setHours(date.getHours());
                  updated.setMinutes(date.getMinutes());
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
      backgroundColor: inputColor,
      width: "100%",
      height: 45,
      borderRadius: 10,
      paddingHorizontal: 20,
      marginVertical: 10,
      color: "#000",
      fontFamily: "InterVariable",
      fontSize: theme.fontSizes.lg,
      fontWeight: "400",
      verticalAlign: "middle",
    },
  };
};
