import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";
import { useConfirm } from "../../hooks/useConfirm";
import { useEffect } from "react";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { UserInfo } from "@/types/auth";

export function UserThreeDotsmenuOptions({
  user,
  closeParent,
}: {
  user: UserInfo;
  closeParent: () => void;
}) {
  const { confirm, showConfirm, hideConfirm } = useConfirm({
    loading: false,
    onConfirm: () => null,
    onCancel: closeParent
  });

  useEffect(() => {
    if (false) {
      hideConfirm();
    }
  }, [hideConfirm]);

  const styles = useThemeStyles(OptionsStyles);
  return (
    <>
      {confirm()}
      <TouchableOpacity style={styles.touchable} onPress={showConfirm}>
        <Ionicons name="trash-outline" size={20} />
        <Text style={styles.text}>Eliminar</Text>
      </TouchableOpacity>
      <View style={{ height: 1, width: "100%", backgroundColor: "black" }} />
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          closeParent();
          router.push({
            pathname: "/user/edit",
            params: {
              userInfo: JSON.stringify(user),
            },
          })
        }}
      >
        <Ionicons name="pencil-outline" size={20} />
        <Text style={styles.text}>Editar</Text>
      </TouchableOpacity>
    </>
  );
}

const OptionsStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.lg,
  },
  touchable: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 10,
  },
});
