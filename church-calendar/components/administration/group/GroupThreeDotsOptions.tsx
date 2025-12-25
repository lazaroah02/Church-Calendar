import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useConfirm } from "@/hooks/useConfirm";
import { useEffect } from "react";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { Group } from "@/types/group";
import { useManageGroups } from "@/hooks/groups/useManageGroups";
import { MyCustomText } from "@/components/MyCustomText";

export function GroupThreeDotsMenuOptions({
  group,
  closeParent,
}: {
  group: Group | null;
  closeParent: () => void;
}) {
  const {handleDeleteGroup, isDeletingGroup, errorDeletingGroup} = useManageGroups({})

  const { confirm, showConfirm, hideConfirm } = useConfirm({
    loading: isDeletingGroup,
    onConfirm: () => handleDeleteGroup(group?.id || 0),
    onCancel: closeParent
  });

  useEffect(() => {
    if (errorDeletingGroup) {
      hideConfirm();
    }
  }, [hideConfirm, errorDeletingGroup]);

  const styles = useThemeStyles(OptionsStyles);
  return (
    <>
      {confirm({})}
      <TouchableOpacity style={styles.touchable} onPress={showConfirm}>
        <Ionicons name="trash-outline" size={20} />
        <MyCustomText style={styles.text}>Eliminar Grupo</MyCustomText>
      </TouchableOpacity>
      <View style={{ height: 1, width: "100%", backgroundColor: "black" }} />
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          closeParent();
          router.replace({
            pathname: "/group/management/edit",
            params: {
              groupInfo: JSON.stringify(group),
            },
          })
        }}
      >
        <Ionicons name="pencil-outline" size={20} />
        <MyCustomText style={styles.text}>Editar Grupo</MyCustomText>
      </TouchableOpacity>
    </>
  );
}

const OptionsStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.md,
  },
  touchable: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 10,
  },
});
