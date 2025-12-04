import { UserTopBar } from "@/components/UserTopBar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <UserTopBar />
      </ScrollView>
    </SafeAreaView>
  );
}

