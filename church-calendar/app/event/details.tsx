import { Event } from "@/types/event";
import { useSearchParams } from "expo-router/build/hooks";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { formatTimeRange } from "@/lib/calendar/calendar-utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { BASE_URL } from "@/api-endpoints";
import { MyNavigationBar } from "@/components/navigation-bar/my-navigation-bar";
import Hyperlink from "react-native-hyperlink";
import { useSession } from "@/hooks/auth/useSession";

export default function EventDetails() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event") as string | undefined;
  const currentDateReadable = searchParams.get("currentDateReadable");
  const parsedEvent: Event | null = eventParam ? JSON.parse(eventParam) : null;
  const styles = useThemeStyles(eventDetailsStyles);
  const {session} = useSession()

  const [isGoing, setIsGoing] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!parsedEvent) {
    return (
      <View style={styles.center}>
        <MyNavigationBar buttonsStyle="dark" />
        <Text style={styles.errorText}>Evento no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <MyNavigationBar buttonsStyle="dark" />
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
          <>
            <TouchableOpacity onPress={() => setIsImageOpen(true)}>
              <Image
                source={{ uri: `${BASE_URL}${parsedEvent.img}` }}
                style={styles.image}
              />
            </TouchableOpacity>

            {/* Modal fullscreen */}
            <Modal
              visible={isImageOpen}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsImageOpen(false)} // <-- Android/iOS back/gesture
            >
              <Pressable
                style={styles.modalContainer}
                onPress={() => setIsImageOpen(false)} // <-- Tocar en zona negra
              >
                <Pressable
                  style={styles.closeArea}
                  onPress={() => setIsImageOpen(false)}
                >
                  <Ionicons name="close" size={40} color="#fff" />
                </Pressable>

                <Image
                  source={{ uri: `${BASE_URL}${parsedEvent.img}` }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              </Pressable>
            </Modal>
          </>
        )}

        {/* Description */}
        <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
          <Text style={styles.description}>{parsedEvent.description}</Text>
        </Hyperlink>

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
      </ScrollView>
      {/* Join button */}
      {parsedEvent.open_to_reservations && session && (
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
      )}
    </SafeAreaView>
  );
}

const eventDetailsStyles = (theme: AppTheme) => ({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: theme.fontSizes.md,
    color: "gray",
    fontFamily: "LexendBold",
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: "500",
    color: "#000",
    fontFamily: "LexendBold",
    paddingRight: 10,
  },
  date: {
    marginBottom: 2,
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: "700",
  },
  time: {
    fontSize: theme.fontSizes.md,
    marginBottom: 2,
    color: "#000",
    fontFamily: "InterVariable",
    fontWeight: "400",
  },
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeArea: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
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
    fontWeight: "400",
  },
  groupColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#5D3731",
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 10,
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
    fontWeight: "600",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.md,
  },
});
