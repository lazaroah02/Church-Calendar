import { useSession } from "../auth/useSession";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCustomToast } from "../useCustomToast";
import { deleteUser } from "@/services/user/management/delete-user";
import { UserManagementData } from "@/types/user";
import { updateUser } from "@/services/user/management/update-user";
import { getUsers } from "@/services/user/management/get-users";
import { UserInfo } from "@/types/auth";
import { useMemo } from "react";
import {
  defaultFiltersValues,
  UserFilters,
} from "@/components/administration/UserFilters";
import { createUser } from "@/services/user/management/create-user";
import { bulkDeleteUsers } from "@/services/user/management/bulk-delete-users";
import { bulkRemoveUsersFromGroup } from "@/services/user/management/bulk-remove-users-from-group";
import { bulkAddUsersToGroup } from "@/services/user/management/bulk-add-users-to-group";

export function useManageUsers({
  searchTerm = "",
  filters = defaultFiltersValues,
}: {
  searchTerm?: string;
  filters?: UserFilters;
}) {
  const { session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  //GET USERS
  const {
    data,
    isLoading: isGettingUsers,
    isError: errorGettingUsers,
    refetch: refetchUsers,
    fetchNextPage: fetchNextPageOfUsers,
    hasNextPage: hasMoreUsers,
    isFetchingNextPage: isGettingMoreUsers,
  } = useInfiniteQuery({
    queryKey: ["users", searchTerm, filters],
    queryFn: ({ pageParam = 1 }) =>
      getUsers({
        token: session?.token || "",
        pageParam: pageParam,
        search: searchTerm,
        filters: filters
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return parseInt(new URL(lastPage.next).searchParams.get("page") || "1");
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 0
  });

  const users: UserInfo[] = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const totalUsers: number = useMemo(() => data?.pages[0]?.count || 0, [data]);

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
      router.replace({
        pathname: "/user/detail",
        params: {
          userInfo: JSON.stringify(data),
        },
      });
    },
  });

  //CREATE USER
  const {
    mutate: handleCreateUser,
    isPending: isCreatingUser,
    error: errorCreatingUser,
    reset: resetCreateUserMutation,
  } = useMutation({
    mutationFn: ({
      data,
      password
    }: {
      data: UserManagementData;
      password: string
    }) =>
      createUser({
        token: session?.token || "",
        data: data,
        password: password
      }),
    onSuccess: (data) => {
      refetchUsers()
      router.back()
    },
  });

  //DELETE USER
  const {
    mutate: handleDeleteUser,
    isPending: isDeletingUser,
    error: errorDeletingUser,
    reset: resetDeleteUserMutation,
  } = useMutation({
    mutationFn: (userId: number | string) =>
      deleteUser({ token: session?.token || "", userId: userId }),
    onSuccess: () => {
      router.back();
      showSuccessToast({ message: "Usuario eliminado con éxito!" });
    },
    onError: () => {
      showErrorToast({
        message: "Error al eliminar el usuario. Revisa tu conexión a internet.",
      });
    },
  });

  //BULK DELETE USERS
  const {
    mutate: handleBulkDeleteUsers,
    isPending: isBulkDeletingUsers,
    error: errorBulkDeletingUsers,
    status: bulkDeleteUsersStatus,
    reset: resetBulkDeleteUsersMutation,
  } = useMutation({
    mutationFn: (userIds: number[]) => {
      return bulkDeleteUsers({ token: session?.token || "", userIds: userIds })
    },
    onSuccess: () => {
      refetchUsers()
      showSuccessToast({ message: "Usuarios eliminados con éxito!" });
    },
    onError: (error) => {
      showErrorToast({
        message: error.message,
      });
    },
  });

  //BULK REMOVE USERS FROM GROUP
  const {
    mutate: handleBulkRemoveUsersFromGroup,
    isPending: isRemovingUsersFromGroup,
    error: errorRemovingUsersFromGroup,
    reset: resetBulkRemoveUsersFromGroupMutation,
    status: bulkRemoveUsersFromGroupStatus
  } = useMutation({
    mutationFn: ({groupId, userIds}:{groupId: number | string, userIds: number[]}) =>
      bulkRemoveUsersFromGroup({ token: session?.token || "", groupId: groupId, userIds: userIds }),
    onSuccess: () => {
      showSuccessToast({ message: "Operación exitosa!" });
    },
    onError: (error) => {
      showErrorToast({
        message: error.message,
      });
    },
  });
  
  //BULK ADD USERS TO GROUP
  const {
    mutate: handleBulkAddUsersToGroup,
    isPending: isAddingUsersToGroup,
    error: errorAddingUsersToGroup,
    reset: resetBulkAddUserstoGroupMutation,
    status: bulkAddUsersToGroupStatus
  } = useMutation({
    mutationFn: ({groupId, userIds}:{groupId: number | string, userIds: number[]}) =>
      bulkAddUsersToGroup({ token: session?.token || "", groupId: groupId, userIds: userIds }),
    onSuccess: () => {
      showSuccessToast({ message: "Operación exitosa!" });
    },
    onError: (error) => {
      showErrorToast({
        message: error.message,
      });
    },
  });

  return {
    handleDeleteUser,
    isDeletingUser,
    errorDeletingUser,
    resetDeleteUserMutation,
    errorUpdatingUser,
    handleUpdateUser,
    isUpdatingUser,
    resetUpdateUserMutation,
    users,
    totalUsers,
    isGettingUsers,
    errorGettingUsers,
    refetchUsers,
    isGettingMoreUsers,
    hasMoreUsers,
    fetchNextPageOfUsers,
    handleCreateUser,
    isCreatingUser,
    errorCreatingUser,
    resetCreateUserMutation,
    handleBulkDeleteUsers,
    isBulkDeletingUsers,
    errorBulkDeletingUsers,
    resetBulkDeleteUsersMutation,
    bulkDeleteUsersStatus,
    handleBulkRemoveUsersFromGroup,
    isRemovingUsersFromGroup,
    errorRemovingUsersFromGroup,
    resetBulkRemoveUsersFromGroupMutation,
    bulkRemoveUsersFromGroupStatus,
    bulkAddUsersToGroup,
    isAddingUsersToGroup,
    errorAddingUsersToGroup,
    bulkAddUsersToGroupStatus
  };
}
