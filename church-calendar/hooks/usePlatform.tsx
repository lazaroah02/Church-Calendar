import { useMemo } from 'react';
import { Platform } from 'react-native';

export const usePlatform = () => {
  const platform = useMemo(() => {
    if (Platform.OS === 'ios') return 'ios';
    if (Platform.OS === 'android') return 'android';
    if (Platform.OS === 'web') return 'web';
    return 'unknown';
  }, []);

  const isWeb = platform === 'web';
  const isMobile = platform === 'ios' || platform === 'android';
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';

  return { platform, isWeb, isMobile, isIOS, isAndroid };
};
