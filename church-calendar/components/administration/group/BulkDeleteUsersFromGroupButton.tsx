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
  onSuccess = () => null
}: {
  group: Group | null;
  selected: any[];
  clearSelected: () => void;
  onSuccess?: () => void
}) {
  const styles = useThemeStyles(Styles);

  /*
  evoid passing filters to this hook for when bulkRemoveUsersFromGroup mutation executes, 
  the refetchUser function updates the users of Users Tab on administration page.
  */ 
  const {
    handleBulkRemoveUsersFromGroup,
    isRemovingUsersFromGroup,
    bulkRemoveUsersFromGroupStatus,
  } = useManageUsers({}); 

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
      onSuccess()
    }
  }, [
    hideConfirm,
    bulkRemoveUsersFromGroupStatus,
    clearSelected,
    onSuccess
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
