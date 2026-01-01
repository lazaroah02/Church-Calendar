import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/hooks/auth/useSession";
import { useMyNavigationBar } from "@/hooks/useMyNavigationBar";

export default function TabLayout() {
  const { session } = useSession();
  useMyNavigationBar({})
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "rgba(236, 161, 0, 1)",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarAllowFontScaling: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "InterVariable",
          fontWeight: "600",
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: "#6a7073ff",
            paddingTop:5
          },
        }),
      }}
      initialRouteName="calendar"
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="administration"
        options={{
          href: session?.userInfo.is_staff ? "/administration" : null,
          title: "Administración",
          tabBarIcon: ({ color }) => (
            <Ionicons name="key-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          href: session ? "/notifications" : null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Opciones",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
