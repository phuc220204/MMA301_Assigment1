import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import AppHeader from '../components/AppHeader';
import ProfileCard from '../components/ProfileCard';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { profile } = useProfile();
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Profile App" />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerArea}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <ProfileCard compact profile={profile} />
            <AppButton
              title="View My Profile"
              onPress={() => navigation.navigate('Profile')}
              style={styles.cardButton}
            />
          </View>
        </View>
        <Text style={[styles.footer, { color: colors.textSecondary }]}>Assignment 1 • React Native</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 26,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  cardButton: {
    marginTop: 28,
  },
  footer: {
    paddingTop: 14,
    textAlign: 'center',
    fontSize: 14,
  },
});
