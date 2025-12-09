import { useConfirm } from "@/hooks/useConfirm";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable } from "react-native";

export function BulkDeleteUsersFromGroupButton({
  group,
  selected,
  clearSelected,
}: {
  group: Group | null;
  selected: any[];
  clearSelected: () => void;
}) {
  const styles = useThemeStyles(Styles);

  const {
    handleBulkRemoveUsersFromGroup,
    isRemovingUsersFromGroup,
    bulkRemoveUsersFromGroupStatus,
    refetchUsers
  } = useManageUsers({
    filters: { member_groups: [group?.id], is_active: "", is_staff: "" },
  });

  const { showConfirm, hideConfirm, confirm } = useConfirm({
    onConfirm: () =>
      handleBulkRemoveUsersFromGroup({
        groupId: group?.id || 0,
        userIds: selected,
      }),
    onCancel: clearSelected,
    loading: isRemovingUsersFromGroup,
  });

  useEffect(() => {
    if (bulkRemoveUsersFromGroupStatus === "error") {
      hideConfirm();
    }
    if (bulkRemoveUsersFromGroupStatus === "success") {
      clearSelected();
      hideConfirm();
      refetchUsers();
    }
  }, [
    hideConfirm,
    bulkRemoveUsersFromGroupStatus,
    clearSelected,
    refetchUsers,
  ]);

  return (
    <>
      {confirm({})}
      {selected.length > 0 && (
        <Pressable onPress={showConfirm} style={styles.deleteSelectedButton}>
          <Ionicons name="trash-outline" size={27} color="white" />
        </Pressable>
      )}
    </>
  );
}

const Styles = (theme: AppTheme) => {
  return {
    deleteSelectedButton: {
      width: 40,
      height: 40,
      position: "absolute",
      bottom: 80,
      left: "60%",
      borderRadius: "100%",
      backgroundColor: "rgba(114, 19, 19, 0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
  };
};
