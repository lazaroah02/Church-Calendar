import { useGroups } from "./useGroups";

export function useManageGroups() {
  const {
    groups,
    isLoading: loadingGroups,
    isError: errorGettingGroups,
    refetch: refetchGroups,
  } = useGroups();
  return { groups, loadingGroups, errorGettingGroups, refetchGroups };
}
