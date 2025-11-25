import { useCallback, useState } from "react";

export function useSelectedItems<T>() {
  const [selected, setSelected] = useState<T[]>([]);

  const toggleSelect = useCallback((id: T) => {
    if (id === undefined) return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const clearSelected = useCallback(() => setSelected([]), []);

  return {
    selected,
    toggleSelect,
    clearSelected,
  };
}
