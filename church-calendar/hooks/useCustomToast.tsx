import { POSTION, useToast } from "expo-toast";
import { useCallback, useMemo } from "react"; // Added useCallback and useMemo

type ToastType = "success" | "error" | "warning";

interface ToastOptions {
  message: string;
  position?: POSTION;
  duration?: number;
}

/**
 * Custom hook to manage toast notifications, ensuring returned functions are stable
 * using useCallback to prevent unnecessary re-renders in dependent hooks/components.
 */
export function useCustomToast() {
  const toast = useToast();

  // Memoize color and style objects to ensure they are stable across renders
  const colors: Record<ToastType, string> = useMemo(
    () => ({
      success: "#4BB543", // verde
      error: "#E74C3C", // rojo
      warning: "#db9b3aff", // amarillo
    }),
    []
  );

  const baseStyle = useMemo(
    () => ({
      borderRadius: 8,
      padding: 12,
    }),
    []
  );

  const textBaseStyle = useMemo(
    () => ({
      color: "white",
      fontWeight: "600" as const,
    }),
    []
  );

  // Memoize the base toast function to ensure it is stable
  const showToast = useCallback(
    ({
      message,
      type,
      position = POSTION.BOTTOM,
      duration = 5000,
    }: ToastOptions & { type: ToastType }) => {
      toast.show(message, {
        position,
        duration,
        containerStyle: {
          ...baseStyle,
          backgroundColor: colors[type],
        },
        textStyle: textBaseStyle,
      });
    },
    // Include all necessary stable dependencies
    [toast, colors, baseStyle, textBaseStyle]
  );

  // Memoize public facing functions, depending only on the stable showToast
  const showSuccessToast = useCallback(
    ({ message, position, duration }: ToastOptions) => {
      showToast({ message, type: "success", position, duration });
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    ({ message, position, duration }: ToastOptions) => {
      showToast({ message, type: "error", position, duration });
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    ({ message, position, duration }: ToastOptions) => {
      showToast({ message, type: "warning", position, duration });
    },
    [showToast]
  );

  return {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
  };
}
