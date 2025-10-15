import { useGroups } from "@/hooks/groups/useGroups";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Falsy,
  ViewStyle,
  RegisteredStyle,
  RecursiveArray,
} from "react-native";

interface ChurchGroupsPickerProps {
  placeholder?: string;
  containerStyle?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
  selectStyle?:
    | Falsy
    | ViewStyle
    | RegisteredStyle<ViewStyle>
    | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>;
  onChange: (selectedGroups: number[]) => void;
  defaultSelectedGroups?: number[];
  excluded_groups?: (number | string)[];
}

const ChurchGroupsPicker = ({
  containerStyle,
  selectStyle,
  placeholder = "Dirigido a",
  onChange = () => null,
  defaultSelectedGroups = [],
  excluded_groups = [],
}: ChurchGroupsPickerProps) => {
  const defaultNotExcludedSelectedGroups = useMemo(
    () =>
      defaultSelectedGroups.filter(
        (groupId: number) => !excluded_groups.includes(groupId)
      ),
    [defaultSelectedGroups, excluded_groups]
  );

  const [selectedGroups, setSelectedGroups] = useState<number[]>(
    defaultNotExcludedSelectedGroups
  );
  const [tempGroups, setTempGroups] = useState<number[]>(
    defaultNotExcludedSelectedGroups
  );
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useThemeStyles(ChurchGroupsPickerStyles);
  const { groups } = useGroups();

  const data = useMemo(
    () =>
      groups
        .filter(
          (group: Group) =>
            !excluded_groups.includes(group.id) &&
            !excluded_groups.includes(group.name)
        )
        .map((group: Group) => ({ label: group.name, value: group.id })),
    [groups, excluded_groups]
  );

  const toggleGroup = (value: number) => {
    if (tempGroups.includes(value)) {
      setTempGroups(tempGroups.filter((id) => id !== value));
    } else {
      setTempGroups([...tempGroups, value]);
    }
  };

  const confirmSelection = () => {
    setSelectedGroups(tempGroups);
    onChange(tempGroups);
    setModalVisible(false);
  };

  const getLabelByValue = (id: number) =>
    data.find((group: { label: string; value: number }) => group.value === id)
      ?.label || "aa";

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Selector visible */}
      <TouchableOpacity
        style={[styles.dropdown, selectStyle]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.placeholderStyle}>{placeholder}</Text>
        <Ionicons
          name="caret-down-outline"
          size={18}
          color={"rgba(0, 0, 0, 0.7)"}
        />
      </TouchableOpacity>

      {selectedGroups.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedGroups.map((id) => (
            <View key={id} style={styles.chip}>
              <Text style={styles.chipText}>{getLabelByValue(id)}</Text>
              <TouchableOpacity
                onPress={() => {
                  const updated = selectedGroups.filter((v) => v !== id);
                  setSelectedGroups(updated);
                  onChange(updated);
                }}
              >
                <Text style={styles.chipClose}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Modal para seleccionar grupos */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalStyle}>
          <Text style={styles.modalTitle}>Selecciona grupos</Text>

          <FlatList
            data={data}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => {
              const isSelected = tempGroups.includes(item.value);
              return (
                <TouchableOpacity
                  style={[styles.item, isSelected && styles.itemSelected]}
                  onPress={() => toggleGroup(item.value)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && styles.itemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Botón Confirmar */}
          <TouchableOpacity
            onPress={confirmSelection}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirmar selección</Text>
          </TouchableOpacity>

          {/* Botón Cancelar */}
          <TouchableOpacity
            onPress={() => {
              setTempGroups(selectedGroups);
              setModalVisible(false);
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const ChurchGroupsPickerStyles = (theme: AppTheme) => ({
  container: { width: "100%" },
  dropdown: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholderStyle: {
    fontSize: theme.fontSizes.lg,
    color: "#000",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#707070",
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
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
  modalStyle: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#F8F8F8",
    marginVertical: 5,
    padding: 12,
    borderRadius: 10,
  },
  itemSelected: {
    backgroundColor: "#707070",
  },
  itemText: {
    fontSize: theme.fontSizes.md,
    color: "#333",
    fontWeight: "600",
  },
  itemTextSelected: {
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#707070",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: theme.fontSizes.lg,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#707070",
    fontSize: theme.fontSizes.lg,
  },
});

export { ChurchGroupsPicker };
