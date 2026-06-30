import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

export default function ThemeToggleSwitch() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={isDark ? 'moon' : 'sunny'} size={23} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>Dark Mode</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isDark ? 'Dark theme is active' : 'Use a darker color palette'}
        </Text>
      </View>
      <Switch
        accessibilityLabel="Dark Mode"
        ios_backgroundColor={colors.border}
        onValueChange={toggleTheme}
        thumbColor={colors.white}
        trackColor={{ false: colors.border, true: colors.primary }}
        value={isDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    marginHorizontal: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
  },
});
