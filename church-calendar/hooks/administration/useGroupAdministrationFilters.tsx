import { Group } from "@/types/group";
import { useEffect, useState } from "react";

export function useGroupAdministrationFilters({ groups }: { groups: Group[] }) {
  const [filteredGroups, setFilteredGroups] = useState(groups);

  const handleSearch = (searchValue: string) => {
    if (searchValue === "") {
      setFilteredGroups(groups);
      return;
    }
    setFilteredGroups((prev) =>
      prev.filter((group) =>
        group.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  return { filteredGroups, handleSearch };
}
