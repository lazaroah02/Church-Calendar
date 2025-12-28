import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, View, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export function TemplatesModal({
  show,
  hide,
  children,
}: {
  show: boolean;
  hide: () => void;
  children: ReactNode;
}) {
  return (
    <Modal transparent visible={show} animationType="fade">
      <Pressable style={{ flex: 1, backgroundColor:"rgba(0, 0, 0, 0.5)" }} onPress={hide}>
        {show && (
          <View
            style={[
              {
                width: "90%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
                backgroundColor: "white",
                borderRadius: 8,
                padding: 10,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Pressable>
                <Ionicons
                  name="close-outline"
                  size={25}
                  color="#000"
                  onPress={hide}
                />
              </Pressable>
            </View>
            <ScrollView>{children}</ScrollView>
          </View>
        )}
      </Pressable>
    </Modal>
  );
}
