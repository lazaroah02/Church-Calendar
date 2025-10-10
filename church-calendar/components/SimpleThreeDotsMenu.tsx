import { Entypo } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { HapticTab } from "./HapticTab";

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
      <HapticTab onPress={() => setVisible(true)}  style={{ padding: 5 }}>
        <Entypo name="dots-three-vertical" size={22} color="black" />
      </HapticTab>

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