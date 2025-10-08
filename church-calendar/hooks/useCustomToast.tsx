import { POSTION, useToast } from "expo-toast";

type ToastType = "success" | "error" | "warning";

export function useCustomToast() {
  const toast = useToast();

  const colors: Record<ToastType, string> = {
    success: "#4BB543", 
    error: "#E74C3C",  
    warning: "#F1C40F",
  };

  const baseStyle = {
    borderRadius: 8,
    padding: 12,
  };

  const textBaseStyle = {
    color: "white",
    fontWeight: "600" as const,
  };

  const showToast = (message: string, type: ToastType, position: POSTION) => {
    toast.show(message, {
      position,
      containerStyle: {
        ...baseStyle,
        backgroundColor: colors[type],
      },
      textStyle: textBaseStyle,
    });
  };

  const showSuccessToast = (message: string, position?: POSTION) =>
    showToast(message, "success", position || POSTION.BOTTOM);

  const showErrorToast = (message: string, position?: POSTION) =>
    showToast(message, "error", position || POSTION.BOTTOM);

  const showWarningToast = (message: string, position?: POSTION) =>
    showToast(message, "warning", position || POSTION.BOTTOM);

  return {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
  };
}
