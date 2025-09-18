import { Event } from "@/types/event";
import { useSearchParams } from "expo-router/build/hooks";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";

export default function EventDetails() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event") as string | undefined;
  const currentDateReadable = searchParams.get("currentDateReadable");
  const parsedEvent: Event | null = eventParam ? JSON.parse(eventParam) : null;
  const styles = useThemeStyles(eventDetailsStyles)

  const [isGoing, setIsGoing] = useState(false);

  if (!parsedEvent) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Evento no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Ionicons
            name="chevron-back"
            size={30}
            color="#000"
            style={{ marginLeft: -8 }}
            onPress={() => router.back()}
          />
          <Text style={styles.title} numberOfLines={3}>
            {parsedEvent.title}
          </Text>
        </View>

        {/* Date, time, and location */}
        <Text style={styles.date}>{currentDateReadable}</Text>
        <Text style={styles.time}>
          Horario:{" "}
          {formatTimeRange(parsedEvent.start_time, parsedEvent.end_time)}
        </Text>
        <Text style={styles.location}>Lugar: {parsedEvent.location}</Text>

        {/* Image */}
        {parsedEvent.img && (
          <Image source={{ uri: parsedEvent.img }} style={styles.image} />
        )}

        {/* Description */}
        <Text style={styles.description}>{parsedEvent.description}</Text>

        {/* Groups */}
        <Text style={styles.groupLabel}>Evento para:</Text>
        <View style={styles.groupsContainer}>
          {parsedEvent.groups_full_info?.map((group) => (
            <View key={group.name} style={styles.group}>
              <View
                style={[
                  styles.groupColor,
                  { backgroundColor: group.color || "#ccc" },
                ]}
              />
              <Text style={styles.groupName}>{group.name}</Text>
            </View>
          ))}
        </View>

        {/* Join button */}
        <TouchableOpacity
          style={[styles.button, isGoing && styles.buttonActive]}
          onPress={() => setIsGoing(!isGoing)}
        >
          <Text style={styles.buttonText}>
            {isGoing ? "Anotado" : "Anotarse"}
          </Text>
          {isGoing ? (
            <Ionicons name="checkbox-outline" size={20} color="#fff" />
          ) : (
            <Ionicons name="square-outline" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const eventDetailsStyles = (theme: AppTheme) =>({
  pageContainer: {
    flex: 1,
    backgroundColor: "#eee",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: theme.fontSizes.md,
    color: "red",
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: 500,
    color: "#000",
    fontFamily: "LexendBold",
    paddingRight:10
  },
  date: {
    marginBottom: 2,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
  },
  time: {
    fontSize: theme.fontSizes.md,
    marginBottom: 2,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: 400,
  },
  location: {
    fontSize: theme.fontSizes.md,
    marginBottom: 2,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: 400,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
    marginBottom: 15,
    borderRadius: 10,
  },
  description: {
    fontSize: theme.fontSizes.md,
    lineHeight: 22,
    color: "#333",
    marginBottom: 15,
  },
  groupLabel: {
    fontWeight: 900,
    marginBottom: 5,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
  },
  groupsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  groupName: {
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
    fontWeight: 400,
  },
  groupColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#5D3731",
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  buttonActive: {
    backgroundColor: "#3D2520",
  },
  buttonText: {
    color: "#fff",
    fontWeight: 600,
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
  },
});
