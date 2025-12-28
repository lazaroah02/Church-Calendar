import { EventTemplate } from "@/types/event";
import { View, Image } from "react-native";
import { MyCustomText } from "../MyCustomText";
import Hyperlink from "react-native-hyperlink";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";
import { getImageUri } from "@/lib/get-image-uri";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { ChurchGroupsPicker } from "../form/church-groups-picker";

export function TemplateDetails({ template }: { template: EventTemplate }) {
  const styles = useThemeStyles(templateDetailsStyles);
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
      {/* Image */}
      {template?.img && (
        <Image
          source={{ uri: getImageUri(template?.img || "") }}
          style={styles.image}
        />
      )}

      <MyCustomText style={styles.groupLabel}>Título:</MyCustomText>
      <MyCustomText style={styles.location}>{template.title}</MyCustomText>

      <MyCustomText style={styles.groupLabel}>Horario:</MyCustomText>
      <MyCustomText style={styles.location}>
        {formatTimeRange(template?.start_time || "", template?.end_time || "")}
      </MyCustomText>

      <MyCustomText style={styles.groupLabel}>Lugar:</MyCustomText>
      <MyCustomText style={styles.location}>{template?.location}</MyCustomText>

      {/* Description */}
      <MyCustomText style={styles.groupLabel}>Descripción:</MyCustomText>
      <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
        <MyCustomText style={styles.description}>
          {template?.description}
        </MyCustomText>
      </Hyperlink>

      {/* Groups */}
      {template.groups.length > 0 && (
        <>
          <MyCustomText style={styles.groupLabel}>Evento para:</MyCustomText>
          <ChurchGroupsPicker
            defaultSelectedGroups={template.groups}
            onChange={() => null}
            onlyPresentational={true}
          />
        </>
      )}
    </View>
  );
}

const templateDetailsStyles = (theme: AppTheme) => ({
  location: {
    fontSize: theme.fontSizes.md,
    marginBottom: 15,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: "400",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
    marginBottom: 15,
    borderRadius: 10,
    objectFit: "contain",
  },
  description: {
    fontSize: theme.fontSizes.md,
    lineHeight: 22,
    color: "#333",
    marginBottom: 15,
    fontFamily: "InterVariable",
  },
  groupLabel: {
    fontWeight: "900",
    marginBottom: 5,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
  },
});
