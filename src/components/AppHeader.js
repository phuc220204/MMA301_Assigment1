import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

export default function AppHeader({ title, onBack }) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.55 : 1 }]}
          >
            <Ionicons name="arrow-back" size={32} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>

      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 72,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 27,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
});
