import { router, Link } from 'expo-router';
import { StatusBar, Text, View } from 'react-native';

import { useSession } from '@/contexts/authContext';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hola</Text>
      <Text
      style={{color:"red"}}
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text>
      <Link href="/(tabs)">Acceder como invitado</Link>
      <StatusBar barStyle={'dark-content'}/>
    </View>
  );
}
