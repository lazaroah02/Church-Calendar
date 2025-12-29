import { UserFilters } from "@/components/administration/UserFilters";
import { debounce } from "@/lib/debounce";
import { useMemo, useState } from "react";

export function useUserAdministrationFilters() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    is_staff: "",
    is_active: "",
    member_groups: [],
  });

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 500),
    []
  );

  return {
    search,
    setSearch,
    filters,
    setFilters,
    debouncedSearch,
  };
}

export function areFiltersActive(search: string, filters: UserFilters) {
  if (search !== "") return true;
  if (
    filters.is_active !== "" ||
    filters.is_staff !== "" ||
    filters.member_groups.length > 0
  ) {
    return true;
  }
  return false;
}
