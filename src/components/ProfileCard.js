import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';

const tags = ['Student', 'Mobile App', 'Dark Mode Ready'];

export default function ProfileCard({ profile, compact = false }) {
  const { colors } = useTheme();

  if (compact) {
    return (
      <View style={styles.compactContent}>
        <Avatar source={profile.avatar} size={108} subtle />
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>Welcome Back!</Text>
        <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
          Manage your personal profile and app appearance in one place.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.profileContent}>
      <Avatar source={profile.avatar} size={132} />
      <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
      <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.bio}</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <View key={tag} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    marginTop: 30,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.7,
  },
  welcomeText: {
    maxWidth: 360,
    marginTop: 12,
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
  },
  profileContent: {
    alignItems: 'center',
  },
  name: {
    marginTop: 24,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  bio: {
    maxWidth: 420,
    marginTop: 10,
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
  },
  tags: {
    marginTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  tag: {
    minHeight: 36,
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
