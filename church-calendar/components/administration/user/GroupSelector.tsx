import { useManageGroups } from "@/hooks/groups/useManageGroups";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Group } from "@/types/group";
import { useState } from "react";
import { FlatList, Modal, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";

export function GroupSelector({
  visible,
  onCancel,
  onConfirm,
  loading
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedGroup: Group) => void;
  loading: boolean
}) {
  const styles = useThemeStyles(GroupSelectorStyles);
  const { groups } = useManageGroups();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalStyle}>
        <Text style={styles.modalTitle}>Selecciona un grupo</Text>

        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedGroup?.id === item.id;
            return (
              <TouchableOpacity
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => setSelectedGroup(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    isSelected && styles.itemTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Confirm Button*/}
        <TouchableOpacity
          onPress={() => {
            if (selectedGroup != null) {
              onConfirm(selectedGroup);
            }
          }}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText} disabled = {loading}>{loading?'Enviando':'Confirmar selección'}</Text>
          {loading && <ActivityIndicator size="small" color={"#fff"}/>}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton} disabled={loading}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const GroupSelectorStyles = (theme: AppTheme) => ({
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
    flexDirection:"row",
    gap: 10,
    alignItems: "center",
    justifyContent:"center",
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
