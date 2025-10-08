import { Entypo } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

export function SimpleThreeDotsMenu({
  children,
  modalStyles = {},
}: {
  children: ReactNode;
  modalStyles: any;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ alignItems: "flex-end", padding: 10, position: "relative" }}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Entypo name="dots-three-vertical" size={22} color="black" />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          {visible && (
            <View
              style={[
                {
                  position: "absolute",
                  top: 60,
                  right: 15,
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                },
                modalStyles,
              ]}
            >
              {children}
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}