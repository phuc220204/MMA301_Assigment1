import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import AppHeader from '../components/AppHeader';
import ProfileCard from '../components/ProfileCard';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { profile } = useProfile();
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="My Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <ProfileCard profile={profile} />
        </View>

        <AppButton
          icon="create-outline"
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.firstButton}
        />
        <AppButton
          icon="settings-outline"
          title="Settings"
          variant="secondary"
          onPress={() => navigation.navigate('Settings')}
          style={styles.secondButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 28,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 22,
    elevation: 4,
  },
  firstButton: {
    marginTop: 30,
  },
  secondButton: {
    marginTop: 14,
  },
});
