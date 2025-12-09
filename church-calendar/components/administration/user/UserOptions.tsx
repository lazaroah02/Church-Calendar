import { useConfirm } from "@/hooks/useConfirm";
import { useManageUsers } from "@/hooks/user/useManageUsers";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Menu } from "react-native-paper";
import { GroupSelector } from "./GroupSelector";
import { useCustomToast } from "@/hooks/useCustomToast";

export function UserOptions({
  closeParent,
  selected = [],
  clearSelected = () => null,
}: {
  closeParent: () => void;
  selected?: any[];
  clearSelected: () => void;
}) {
  const {
    handleBulkDeleteUsers,
    isBulkDeletingUsers,
    bulkDeleteUsersStatus,
    handleBulkAddUsersToGroup,
    isAddingUsersToGroup,
    bulkAddUsersToGroupStatus,
  } = useManageUsers({});

  const { confirm, showConfirm, hideConfirm } = useConfirm({
    onCancel: () => closeParent(),
    onConfirm: () => handleBulkDeleteUsers(selected),
    loading: isBulkDeletingUsers,
  });

  const { showErrorToast } = useCustomToast();

  const [showGroupSelectorModal, setShowGroupSelectorModal] = useState(false);

  // useEffect to control when to hide the confirm dialog depending on bulkDeleteUsersStatus
  useEffect(() => {
    if (bulkDeleteUsersStatus === "error") {
      hideConfirm();
      closeParent();
    }
    if (bulkDeleteUsersStatus === "success") {
      hideConfirm();
      closeParent();
      clearSelected();
    }
  }, [hideConfirm, bulkDeleteUsersStatus, closeParent, clearSelected]);

  // useEffect to control when to hide the group selecter modal  depending on bulkAddUsersToGroupStatus
  useEffect(() => {
    if (bulkAddUsersToGroupStatus === "error") {
      setShowGroupSelectorModal(false);
      closeParent();
    }
    if (bulkAddUsersToGroupStatus === "success") {
      setShowGroupSelectorModal(false);
      clearSelected();
      closeParent();
    }
  }, [bulkAddUsersToGroupStatus, clearSelected, closeParent]);

  return (
    <>
      {confirm({})}
      <GroupSelector
        visible={showGroupSelectorModal}
        onCancel={() => {
          setShowGroupSelectorModal(false);
        }}
        loading={isAddingUsersToGroup}
        onConfirm={(selectedGroup) => {
          handleBulkAddUsersToGroup({
            groupId: selectedGroup.id,
            userIds: selected,
          });
        }}
      />
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
          if (selected.length === 0) {
            showErrorToast({ message: "Debes seleccionar algun usuario" });
            return;
          }
          showConfirm();
        }}
      />
      <Menu.Item
        title="Agregar a Grupo"
        leadingIcon="link"
        onPress={() => {
          if (selected.length === 0) {
            showErrorToast({ message: "Debes seleccionar algun usuario" });
            return;
          }
          setShowGroupSelectorModal(true);
        }}
      />
    </>
  );
}
