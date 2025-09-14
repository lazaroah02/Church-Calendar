import { UserTopBar } from '@/components/UserTopBar';
import { StyleSheet, Text } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function Calendar() {
  return (
    <SafeAreaView>
      <UserTopBar/>
        <Text>Calendar</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 
});
