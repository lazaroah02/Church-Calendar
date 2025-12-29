import { Event } from "@/types/event";
import { useSearchParams } from "expo-router/build/hooks";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import {
  formatTimeStamp,
  formatTimeRange,
  formatSelectedDay,
} from "@/lib/calendar/calendar-utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { BASE_URL } from "@/api-endpoints";
import Hyperlink from "react-native-hyperlink";
import { useSession } from "@/hooks/auth/useSession";
import { getImageUri } from "@/lib/get-image-uri";
import { SimpleThreeDotsMenu } from "@/components/SimpleThreeDotsMenu";
import { EventTrheeDotsmenuOptions } from "@/components/event/event-three-dots-menu-options";
import { PageHeader } from "@/components/PageHeader";
import { useCalendarEventsContext } from "@/contexts/calendar-context/calendarContext";
import { ReserveEvent } from "@/components/event/reserv-event";
import { UserAvatar } from "@/components/user/user-avatar";
import { MyCustomText } from "@/components/MyCustomText";
import { Collapsible } from "@/components/Collapsible";

export default function EventDetails() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event") as string | undefined;
  const { selectedDay } = useCalendarEventsContext();
  const currentDateReadable = formatSelectedDay(selectedDay.dateString);
  const parsedEvent: Event | null = eventParam ? JSON.parse(eventParam) : null;
  const styles = useThemeStyles(eventDetailsStyles);
  const { session } = useSession();
  const isAdmin = session?.userInfo.is_staff || false;
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    if (!parsedEvent) {
      router.replace("/+not-found");
    }
  }, [parsedEvent]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <PageHeader
        title={parsedEvent?.title}
        rightComponent={
          isAdmin && (
            <SimpleThreeDotsMenu
              modalStyles={{ right: 30, top: 70 }}
              childrenComponentFunction={(closeParent) => (
                <EventTrheeDotsmenuOptions
                  event={parsedEvent}
                  closeParent={closeParent}
                />
              )}
            ></SimpleThreeDotsMenu>
          )
        }
      />
      <ScrollView contentContainerStyle={styles.container}>
        {parsedEvent?.is_canceled && (
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <MyCustomText
              style={[
                styles.groupLabel,
                {
                  alignSelf: "flex-start",
                  backgroundColor: "orange",
                  padding: 4,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                },
              ]}
            >
              Cancelado
            </MyCustomText>
          </View>
        )}

        {/* Date, time, and location */}
        <MyCustomText style={styles.date}>{currentDateReadable}</MyCustomText>
        <MyCustomText style={styles.time}>
          Horario:{" "}
          {formatTimeRange(
            parsedEvent?.start_time || "",
            parsedEvent?.end_time || ""
          )}
        </MyCustomText>
        <MyCustomText style={styles.location}>
          Lugar: {parsedEvent?.location}
        </MyCustomText>

        {/* Image */}
        {parsedEvent?.img && (
          <>
            <TouchableOpacity onPress={() => setIsImageOpen(true)}>
              <Image
                source={{ uri: getImageUri(parsedEvent?.img || "") }}
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
                  source={{ uri: getImageUri(parsedEvent?.img || "") }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              </Pressable>
            </Modal>
          </>
        )}

        {/* Description */}
        <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
          <MyCustomText style={styles.description}>
            {parsedEvent?.description}
          </MyCustomText>
        </Hyperlink>

        {/* Groups */}
        <MyCustomText style={styles.groupLabel}>Evento para:</MyCustomText>
        <View style={styles.groupsContainer}>
          {parsedEvent?.groups_full_info?.map((group) => (
            <View key={group.name} style={styles.group}>
              <View
                style={[
                  styles.groupColor,
                  { backgroundColor: group.color || "#ccc" },
                ]}
              />
              <MyCustomText style={styles.groupName}>{group.name}</MyCustomText>
            </View>
          ))}
        </View>

        {isAdmin && (
          <>
            {/* Estado */}
            <MyCustomText style={styles.groupLabel}>
              Estado del Evento:
            </MyCustomText>
            <MyCustomText style={styles.groupName}>
              • {parsedEvent?.is_canceled ? "Cancelado" : "No Cancelado"}
            </MyCustomText>
            <MyCustomText style={styles.groupName}>
              • {parsedEvent?.visible ? "Visible" : "Oculto"}
            </MyCustomText>
            <MyCustomText style={styles.groupName}>
              •{" "}
              {parsedEvent?.open_to_reservations
                ? "Abierto a reservaciones"
                : "Cerrado a reservaciones"}
            </MyCustomText>
          </>
        )}

        {isAdmin && (
          <Collapsible
            title="Datos del Creador"
            style={{ marginTop: 25, marginLeft: -5 }}
          >
            {/*Created by*/}
            {parsedEvent?.created_by_full_info && (
              <UserAvatar
                title={`Creado el ${formatTimeStamp(
                  parsedEvent?.created_at || ""
                )} por:`}
                user={parsedEvent?.created_by_full_info}
              />
            )}

            {/*Last Edit by*/}
            {parsedEvent?.last_edit_by_full_info && (
              <UserAvatar
                title={`Última edición el ${formatTimeStamp(
                  parsedEvent?.updated_at || ""
                )} por:`}
                user={parsedEvent?.last_edit_by_full_info}
              />
            )}
          </Collapsible>
        )}
      </ScrollView>

      <ReserveEvent event={parsedEvent} />
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
    paddingTop: 0,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: theme.fontSizes.md,
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
    fontSize: theme.fontSizes.md,
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
});
