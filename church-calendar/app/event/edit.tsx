import { EventForm } from "@/components/event/event-form";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { Event } from "@/types/event";
import { useSearchParams } from "expo-router/build/hooks";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventEdit() {
  const searchParams = useSearchParams();
  const eventInfo = searchParams.get("eventInfo") as string | undefined;
  const event: Event | null = eventInfo ? JSON.parse(eventInfo) : null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar style="dark" />
      <EventForm
        isPending={false}
        event={event}
        handleSubmit={(values) => console.log(values)}
      />
    </SafeAreaView>
  );
}
