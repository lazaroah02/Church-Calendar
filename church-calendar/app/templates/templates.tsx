import { MyCustomText } from "@/components/MyCustomText";
import { PageHeader } from "@/components/PageHeader";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { TemplateComponent } from "@/components/templates/template-component";
import { TemplateDetails } from "@/components/templates/template-details";
import { TemplatesModal } from "@/components/templates/templates-modal";
import { useSession } from "@/hooks/auth/useSession";
import { useTemplates } from "@/hooks/events/useTemplates";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { EventTemplate } from "@/types/event";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventTemplates() {
  const { session } = useSession();
  const isAdmin = session?.userInfo.is_staff;
  const styles = useThemeStyles(TemplatesPageStyles);

  const { loadingTemplates, templates, refetchTemplates, removeTemplate } =
    useTemplates();

  const [showTemplateDetailsModal, setShowTemplateDetailsModal] =
    useState(false);
  const [currentTemplateDetails, setCurrentTemplateDetails] =
    useState<EventTemplate | null>(null);

  //guard for non admin users
  useEffect(() => {
    if (!isAdmin) {
      router.replace("/+not-found");
      return;
    }
  }, [isAdmin]);

  //refect templates on focus
  useFocusEffect(
    useCallback(() => {
      refetchTemplates();
    }, [refetchTemplates])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PageHeader
        title="Plantillas de Eventos"
        rightComponent={
          <SimpleThreeDotsMenu
            modalStyles={{ right: 30, top: 70 }}
            childrenComponentFunction={(closeParent) => (
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => {
                  closeParent();
                  router.push("/templates/create");
                }}
              >
                <Ionicons name="add-outline" size={20} />
                <MyCustomText style={styles.text}>Crear</MyCustomText>
              </TouchableOpacity>
            )}
          ></SimpleThreeDotsMenu>
        }
      />
      <TemplatesModal
        show={showTemplateDetailsModal}
        hide={() => setShowTemplateDetailsModal(false)}
      >
        <TemplateDetails template={currentTemplateDetails} />
      </TemplatesModal>
      <FlatList
        data={templates}
        onRefresh={refetchTemplates}
        refreshing={loadingTemplates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.templateContainer}>
              <TemplateComponent
                item={item}
                onPress={() => {
                  setCurrentTemplateDetails(item);
                  setShowTemplateDetailsModal(true);
                }}
              />
              <View style={styles.templateActionsContainer}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#000"
                  onPress={() => removeTemplate(item.id)}
                />
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const TemplatesPageStyles = (theme: AppTheme) => ({
  text: {
    fontSize: theme.fontSizes.md,
  },
  touchable: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
  },
  templateContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  templateActionsContainer: {
    flexDirection: "row",
    gap: 20,
  },
});
