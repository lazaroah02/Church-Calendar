import { useConfirm } from "@/hooks/useConfirm";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { router } from "expo-router";
import { useEffect } from "react";
import { Menu } from "react-native-paper";

export function UserOptions({
  closeParent,
  selected = [],
  clearSelected = () => null
}: {
  closeParent: () => void;
  selected?: any[];
  clearSelected: () => void
}) {
  const {
    handleBulkDeleteUsers,
    isBulkDeletingUsers,
    bulkDeleteUsersStatus,
  } = useManageUsers({});

  const { confirm, showConfirm, hideConfirm } = useConfirm({
    onCancel: () => closeParent(),
    onConfirm: () => handleBulkDeleteUsers(selected),
    loading: isBulkDeletingUsers,
  });

  useEffect(() => {
    if (bulkDeleteUsersStatus === "error" || bulkDeleteUsersStatus === "success") {
      hideConfirm();
      closeParent();
    }
    if (bulkDeleteUsersStatus === "success") {
      hideConfirm();
      closeParent();
      clearSelected()
    }
  }, [hideConfirm, bulkDeleteUsersStatus, closeParent, clearSelected]);

  return (
    <>
      {confirm()}
      <Menu.Item
        title="Crear"
        leadingIcon="plus"
        onPress={() => {
          router.push("/user/management/create");
          closeParent();
        }}
      />
      <Menu.Item
        title="Eliminar"
        leadingIcon="delete"
        onPress={() => {
          showConfirm();
        }}
      />
      <Menu.Item
        title="Agregar a Grupo"
        leadingIcon="link"
        onPress={() => {
          
        }}
      />
    </>
  );
}
