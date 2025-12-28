import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyCustomText } from "../MyCustomText";
import { TemplatesModal } from "../templates/templates-modal";
import { useState } from "react";
import { TemplateComponent } from "../templates/template-component";
import { EventTemplate } from "@/types/event";

export function CreateEventTrheeDotsmenuOptions({
  closeParent,
  templates = [],
  handleImportTemplate = () => null,
}: {
  closeParent: () => void;
  templates: EventTemplate[];
  handleImportTemplate?: (template: EventTemplate) => void;
}) {
  const styles = useThemeStyles(OptionsStyles);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  return (
    <>
      {
        <TemplatesModal
          show={showTemplatesModal}
          hide={() => setShowTemplatesModal(false)}
        >
          <View style={{ paddingHorizontal: 10 }}>
            {templates.map((template) => (
              <TemplateComponent
                key={template.id}
                item={template}
                onPress={() => {
                  handleImportTemplate(template);
                  closeParent();
                }}
              />
            ))}
          </View>
        </TemplatesModal>
      }
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setShowTemplatesModal(true)}
      >
        <Ionicons name="download-outline" size={20} />
        <MyCustomText style={styles.text}>Importar Plantilla</MyCustomText>
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
    gap: 10,
    alignItems: "center",
    padding: 10,
  },
});
