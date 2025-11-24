import { useState } from "react";

export function useSelectedItems<T>() {
  const [selected, setSelected] = useState<T[]>([]);

  const toggleSelect = (id: T) => {
    if (id === undefined) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelected = () => setSelected([])

  return {
    selected,
    toggleSelect,
    clearSelected
  };
}
