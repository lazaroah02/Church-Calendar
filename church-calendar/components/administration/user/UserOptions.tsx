import { useConfirm } from "@/hooks/useConfirm";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { router } from "expo-router";
import { useEffect } from "react";
import { Menu } from "react-native-paper";

export function UserOptions({
  closeParent,
  selected = [],
}: {
  closeParent: () => void;
  selected?: any[];
}) {
  const {
    handleBulkDeleteUsers,
    isBulkDeletingUsers,
    errorBulkDeletingUsers,
    bulkDeleteUsersStatus,
  } = useManageUsers({});

  const { confirm, showConfirm, hideConfirm } = useConfirm({
    onCancel: () => closeParent(),
    onConfirm: () => handleBulkDeleteUsers(selected),
    loading: isBulkDeletingUsers,
  });

  useEffect(() => {
    if (errorBulkDeletingUsers) {
      hideConfirm();
      closeParent();
    }
    if (bulkDeleteUsersStatus === "success") {
      hideConfirm();
      closeParent();
    }
  }, [errorBulkDeletingUsers, hideConfirm, bulkDeleteUsersStatus, closeParent]);

  return (
    <>
      {confirm()}
      <Menu.Item
        title="Crear"
        onPress={() => {
          router.push("/user/management/create");
          closeParent();
        }}
      />
      <Menu.Item
        title="Eliminar"
        onPress={() => {
          showConfirm();
        }}
      />
    </>
  );
}
