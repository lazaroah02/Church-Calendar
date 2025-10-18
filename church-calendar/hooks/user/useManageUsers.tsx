import { useSession } from "../auth/useSession";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCustomToast } from "../useCustomToast";
import { deleteUser } from "@/services/user/management/delete-user";
import { UserManagementData } from "@/types/user";
import { updateUser } from "@/services/user/management/update-user";
import { getUsers } from "@/services/user/management/get-users";
import { UserInfo } from "@/types/auth";
import { useMemo } from "react";

export function useManageUsers() {
  const { session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  //GET USERS
  const { data, isLoading: isGettingUsers, isError: errorGettingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ token: session?.token || "" }),
  });

  const users: UserInfo[] = useMemo(() => data?.results || [], [data])
  const totalUsers: number = useMemo(() => data?.count || 0,[data])

  //UPDATE USER
  const {
    mutate: handleUpdateUser,
    isPending: isUpdatingUser,
    error: errorUpdatingUser,
    reset: resetUpdateUserMutation,
  } = useMutation({
    mutationFn: ({
      data,
      userId,
    }: {
      data: UserManagementData;
      userId: number | string | undefined;
    }) =>
      updateUser({
        token: session?.token || "",
        data: data,
        userId: userId,
      }),
    onSuccess: (data) => {
      //refreshUsers()
      router.replace({
        pathname: "/user/detail",
        params: {
          userInfo: JSON.stringify(data),
        },
      });
    },
  });

  //DELETE USER
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
    errorUpdatingUser,
    handleUpdateUser,
    isUpdatingUser,
    resetUpdateUserMutation,
    users,
    totalUsers,
    isGettingUsers,
    errorGettingUsers,
    refetchUsers
  };
}
