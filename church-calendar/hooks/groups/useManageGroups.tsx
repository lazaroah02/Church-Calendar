import { useMutation } from "@tanstack/react-query";
import { useGroups } from "./useGroups";
import { deleteGroup } from "@/services/groups/management/delete-group";
import { useSession } from "../auth/useSession";
import { router } from "expo-router";
import { useCustomToast } from "../useCustomToast";
import { updateGroup } from "@/services/groups/management/update-group";
import { GroupManagementData } from "@/types/group";
import { createGroup } from "@/services/groups/management/create-group";

export function useManageGroups() {
  const { session } = useSession();

  const { showSuccessToast, showErrorToast } = useCustomToast();

  const {
    groups,
    isLoading: loadingGroups,
    isError: errorGettingGroups,
    refetch: refetchGroups,
  } = useGroups();

  //DELETE GROUP
  const {
    mutate: handleDeleteGroup,
    isPending: isDeletingGroup,
    error: errorDeletingGroup,
    reset: resetDeleteGroupMutation,
  } = useMutation({
    mutationFn: (groupId: number | string) =>
      deleteGroup({ token: session?.token || "", groupId: groupId }),
    onSuccess: () => {
      refetchGroups();
      router.back();
      showSuccessToast({ message: "Grupo eliminado con éxito!" });
    },
    onError: () => {
      showErrorToast({
        message: "Error al eliminar el grupo. Revisa tu conexión a internet.",
      });
    },
  });

  //UPDATE GROUP
  const {
    mutate: handleUpdateGroup,
    isPending: isUpdatingGroup,
    error: errorUpdatingGroup,
    reset: resetUpdateGroupMutation,
  } = useMutation({
    mutationFn: ({
      data,
      groupId,
    }: {
      data: GroupManagementData;
      groupId: number | string | undefined;
    }) =>
      updateGroup({
        token: session?.token || "",
        data: data,
        groupId: groupId,
      }),
    onSuccess: (data) => {
      refetchGroups();
      router.replace({
        pathname: "/group/management/detail",
        params: {
          groupInfo: JSON.stringify(data),
        },
      });
    },
  });

  //CREATE GROUP
  const {
    mutate: handleCreateGroup,
    isPending: isCreatingGroup,
    error: errorCreatingGroup,
    reset: resetCreateGroupMutation,
  } = useMutation({
    mutationFn: ({ data }: { data: GroupManagementData }) =>
      createGroup({
        token: session?.token || "",
        data: data,
      }),
    onSuccess: (data) => {
      refetchGroups();
      router.back();
    },
  });

  return {
    groups,
    loadingGroups,
    errorGettingGroups,
    refetchGroups,
    handleDeleteGroup,
    isDeletingGroup,
    errorDeletingGroup,
    resetDeleteGroupMutation,
    handleUpdateGroup,
    isUpdatingGroup,
    errorUpdatingGroup,
    resetUpdateGroupMutation,
    handleCreateGroup,
    isCreatingGroup,
    errorCreatingGroup,
    resetCreateGroupMutation
  };
}
