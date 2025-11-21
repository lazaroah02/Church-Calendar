import { useMutation } from "@tanstack/react-query";
import { useGroups } from "./useGroups";
import { deleteGroup } from "@/services/groups/management/delete-group";
import { useSession } from "../auth/useSession";
import { router } from "expo-router";
import { useCustomToast } from "../useCustomToast";

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
      refetchGroups()
      router.back();
      showSuccessToast({ message: "Grupo eliminado con éxito!" });
    },
    onError: () => {
      showErrorToast({
        message: "Error al eliminar el grupo. Revisa tu conexión a internet.",
      });
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
  };
}
