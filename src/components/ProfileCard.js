/**
 * ProfileCard.js — Khối hiển thị thông tin profile, dùng lại ở 2 ngữ cảnh.
 * Vai trò: ở chế độ compact -> lời chào ngắn (màn Home); chế độ thường -> avatar + tên + bio + tags
 * (màn Profile).
 */
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';

// Danh sách tag tĩnh hiển thị ở chế độ đầy đủ (không phụ thuộc dữ liệu profile).
const tags = ['Student', 'Mobile App', 'Dark Mode Ready'];

// ProfileCard: thẻ thông tin profile.
// Props:
//   - profile: object { name, bio, avatar } lấy từ ProfileContext.
//   - compact: true -> bản gọn (lời chào, dùng ở Home); false -> bản đầy đủ. Mặc định false.
// Trả về: UI khác nhau tùy compact.
export default function ProfileCard({ profile, compact = false }) {
  const { colors } = useTheme();

  // Nhánh compact: thoát sớm (early return) với layout lời chào gọn cho màn Home.
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

  // Nhánh mặc định: bản đầy đủ với tên, bio thật và danh sách tag.
  return (
    <View style={styles.profileContent}>
      <Avatar source={profile.avatar} size={132} />
      <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
      <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.bio}</Text>
      <View style={styles.tags}>
        {/* Lặp mảng tags để render từng chip; key=tag vì các tag là duy nhất */}
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
