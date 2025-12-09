import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useThemeStyles } from "./useThemedStyles";
import { AppTheme } from "@/theme";

export function useConfirm({
  onCancel = () => null,
  onConfirm = () => null,
  loading = false,
}: {
  onCancel?: () => void;
  onConfirm?: () => void;
  loading?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
    setVisible(false);
  }, [onCancel]);

  const showConfirm = useCallback(() => {
    setVisible(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setVisible(false);
  }, []);

  const styles = useThemeStyles(ConfirmStyles);

  const confirm = useCallback(
    ({
      title = "Cuidado!",
      message = "¿Estás seguro de la operación que quieres realizar?",
    }: {
      title?: string;
      message?: string;
    }) => {
      return (
        <Modal visible={visible} animationType="fade" transparent>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => !loading && hideConfirm()}
          >
            <View
              style={{
                width: "90%",
                backgroundColor: "white",
                borderRadius: 8,
                padding: 20,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text style={[styles.text, { fontFamily: "LexendBold" }]}>
                {title}
              </Text>
              <Text style={[styles.text, { marginVertical: 10 }]}>
                {message}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  disabled={loading}
                  onPress={handleCancel}
                  style={styles.cancelButton}
                >
                  <Text style={[styles.text]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                  disabled={loading}
                >
                  <Text style={[styles.text]}>Continuar</Text>
                  {loading && <ActivityIndicator size="small" />}
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      );
    },
    [visible, loading, handleCancel, handleConfirm, hideConfirm]
  );

  return { confirm, showConfirm, hideConfirm };
}

const ConfirmStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.lg,
    fontFamily: "InterVariable",
  },
  confirmButton: {
    backgroundColor: "rgba(236, 161, 0, 1)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 10,
    borderRadius: 15,
  },
  cancelButton: {
    backgroundColor: "rgba(181, 181, 181, 0.6)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 10,
    borderRadius: 15,
  },
});
