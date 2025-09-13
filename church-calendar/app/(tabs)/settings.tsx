import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '@/contexts/authContext';
import { Link } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';

export default function Settings() {
  const {signOut} = useSession()
  return (
    <SafeAreaView>
      <Link style = {{color:"red"}} href="/welcome">Sign in</Link>
      <Pressable onPress={() => {
        signOut()
        navigate("/welcome")
        }}><Text style={{color:"green"}}>Sign out</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
