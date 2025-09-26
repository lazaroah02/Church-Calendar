import { useSession } from "@/hooks/auth/useSession";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEvent(){
    const {session} = useSession()
    return(
        <SafeAreaView>
            <Text>Crear Evento</Text>
        </SafeAreaView>
    )
}