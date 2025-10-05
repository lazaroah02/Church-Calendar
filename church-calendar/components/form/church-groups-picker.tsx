import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Falsy,
  ViewStyle,
  RegisteredStyle,
  RecursiveArray,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

interface ChurchGroupsPickerProps {
  placeholder?: string;
  containerStyle?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
}

const ChurchGroupsPicker = ({
  containerStyle,
  placeholder = "Dirigido a",
}: ChurchGroupsPickerProps) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const styles = useThemeStyles(ChurchGroupsPickerStyles);

  const data = [
    { label: "Danza", value: "1" },
    { label: "Jóvenes", value: "2" },
    { label: "Música", value: "3" },
    { label: "Teatro", value: "4" },
    { label: "Voluntariado", value: "5" },
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Buscar..."
        value={selectedGroups}
        onChange={(item) => setSelectedGroups(item)}
        mode="modal"
        containerStyle={styles.modalStyle}
        renderItem={(item) => {
          const isSelected = selectedGroups.some((val) => val === item.value);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (isSelected) {
                  setSelectedGroups(
                    selectedGroups.filter((v) => v !== item.value)
                  );
                } else {
                  setSelectedGroups([...selectedGroups, item.value]);
                }
              }}
              style={[styles.item, isSelected && styles.itemSelected]}
            >
              <Text
                style={[styles.itemText, isSelected && styles.itemTextSelected]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
        renderSelectedItem={(item, unSelect) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item.label}</Text>
            <TouchableOpacity onPress={() => unSelect?.(item)}>
              <Text style={styles.chipClose}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const ChurchGroupsPickerStyles = (theme: AppTheme) => ({
  container: {
    width: "100%",
  },
  dropdown: {
    backgroundColor: "#F2F2F2",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeholderStyle: {
    fontSize: theme.fontSizes.lg,
    color: "#000",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 22,
    height: 22,
    tintColor: "#000",
  },
  modalStyle: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 10,
    fontFamily: "InterVariable",
  },
  item: {
    marginVertical: 6,
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 48,
  },
  itemSelected: {
    backgroundColor: "#707070",
  },
  itemText: {
    fontSize: theme.fontSizes.md,
    color: "#333",
    fontWeight: "600",
    fontFamily: "InterVariable",
  },
  itemTextSelected: {
    color: "#fff",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#707070",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    margin: 3,
  },
  chipText: {
    color: "#fff",
    fontSize: theme.fontSizes.md,
  },
  chipClose: {
    color: "#fff",
    marginLeft: 6,
    fontSize: theme.fontSizes.xl,
    lineHeight: 16,
  },
});

export { ChurchGroupsPicker };
