import { getGroups } from "@/services/groups/get-groups";
import { useQuery } from "@tanstack/react-query";

export function useGroups() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 0,
  });
  const groups = data || [];

  return { groups, isLoading, isError, refetch };
}
