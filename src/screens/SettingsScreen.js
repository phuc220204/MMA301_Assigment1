import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import ThemeToggleSwitch from '../components/ThemeToggleSwitch';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <ThemeToggleSwitch />
        </View>

        <Text style={[styles.sectionLabel, styles.previewLabel, { color: colors.textSecondary }]}>THEME PREVIEW</Text>
        <View style={[styles.card, styles.previewCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={[styles.previewIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={32} color={colors.primary} />
          </View>
          <Text style={[styles.previewTitle, { color: colors.text }]}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text style={[styles.previewText, { color: colors.textSecondary }]}>
            This preview updates instantly across every screen in the app.
          </Text>
          <View style={styles.swatches}>
            {[colors.primary, colors.primaryLight, colors.background, colors.border].map((color, index) => (
              <View
                key={`${color}-${index}`}
                style={[styles.swatch, { backgroundColor: color, borderColor: colors.border }]}
              />
            ))}
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>Theme managed with Context API</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionLabel: {
    marginLeft: 6,
    marginBottom: 9,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  previewLabel: {
    marginTop: 28,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  previewCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  previewIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    marginTop: 17,
    fontSize: 22,
    fontWeight: '800',
  },
  previewText: {
    maxWidth: 360,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  swatches: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
  },
  footer: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    paddingTop: 42,
    fontSize: 13,
  },
});
