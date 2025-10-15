import { useSession } from "../auth/useSession";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCustomToast } from "../useCustomToast";
import { deleteUser } from "@/services/user/management/delete-user";

export function useManageUsers() {
  const { session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const {
    mutate: handleDeleteUser,
    isPending: isDeletingUser,
    error: errorDeletingUser,
    reset: resetDeleteEventMutation,
  } = useMutation({
    mutationFn: (userId: number | string) =>
      deleteUser({ token: session?.token || "", userId: userId }),
    onSuccess: () => {
      //refreshUsers()
      router.back();
      showSuccessToast({ message: "Usuario eliminado con éxito!" });
    },
    onError: () => {
      showErrorToast({
        message: "Error al eliminar el usuario. Revisa tu conexión a internet.",
      });
    },
  });

  return {
    handleDeleteUser,
    isDeletingUser,
    errorDeletingUser,
    resetDeleteEventMutation,
  };
}
