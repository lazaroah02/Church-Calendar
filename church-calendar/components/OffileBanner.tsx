import { View } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { MyCustomText } from './MyCustomText';
import { useThemeStyles } from '@/hooks/useThemedStyles';
import { AppTheme } from '@/theme';

export function OfflineBanner() {
  const styles = useThemeStyles(offlineBannerStyles);
  const isConnected = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <MyCustomText style={styles.text}>Sin conexión a Internet</MyCustomText>
    </View>
  );
}

const offlineBannerStyles = (theme: AppTheme) =>({
  container: {
    width: '100%',
    backgroundColor: '#9d0303ff',
    paddingVertical: 2,
    zIndex: 999,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.fontSizes.xsm
  },
});
