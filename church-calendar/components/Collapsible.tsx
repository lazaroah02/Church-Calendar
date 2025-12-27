import { PropsWithChildren, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { AppTheme } from '@/theme';
import { useThemeStyles } from '@/hooks/useThemedStyles';
import { MyCustomText } from './MyCustomText';

export function Collapsible({ children, title, style }: PropsWithChildren & { title: string, style: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = useThemeStyles(collapsibleStyles)

  return (
    <View>
      <TouchableOpacity
        style={[styles.heading, style]}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color="#000"
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <MyCustomText type="defaultSemiBold" style={styles.title}>{title}</MyCustomText>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const collapsibleStyles = (theme: AppTheme) =>({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
  title:{
    fontSize:theme.fontSizes.md,
    fontFamily:"InterVariable",
    fontWeight:700
  }
});
