import { useMemo } from "react";
import { DateData } from "react-native-calendars";
import { useSearchParams } from "expo-router/build/hooks";

// Validator for DateData structure
function isValidDateData(obj: any): obj is DateData {
  return (
    obj &&
    typeof obj.year === "number" &&
    typeof obj.month === "number" &&
    typeof obj.day === "number" &&
    typeof obj.timestamp === "number" &&
    typeof obj.dateString === "string"
  );
}

export function useSelectedDayFromParams(): DateData | null {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const raw = searchParams.get("selectedDayParam");
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);

      if (isValidDateData(parsed)) {
        return parsed;
      }

      console.warn("selectedDayParam has invalid structure:", parsed);
      return null;
    } catch (e) {
      console.warn("Invalid JSON for selectedDayParam:", e);
      return null;
    }
  }, [searchParams]);
}
