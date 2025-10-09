import { getGroups } from "@/services/groups/get-groups";
import { useQuery } from "@tanstack/react-query";

export function useGroups() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
  const groups = data || [];

  return { groups, isLoading, isError, refetch };
}
