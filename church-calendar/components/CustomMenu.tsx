import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "react-native-paper";

export function CustomMenu({
  renderItems = () => null,
}: {
  renderItems: (closeParent: () => void) => ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchorPosition="bottom"
      contentStyle={{ marginTop: 15, backgroundColor: "#fff" }}
      anchor={
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Ionicons
            name="ellipsis-vertical"
            size={25}
            color={"rgba(0, 0, 0, 0.7)"}
          />
        </TouchableOpacity>
      }
    >
      {renderItems(() => setVisible(false))}
    </Menu>
  );
}
