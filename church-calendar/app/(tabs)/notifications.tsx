import { UserTopBar } from '@/components/UserTopBar';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
  return (
    <SafeAreaView>
      <UserTopBar/>
      <Text>Notifications</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
