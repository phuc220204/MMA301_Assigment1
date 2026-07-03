/**
 * ThemeToggleSwitch.js — Hàng cài đặt bật/tắt Dark Mode.
 * Vai trò: hiển thị icon + mô tả và 1 Switch; gạt Switch sẽ gọi toggleTheme từ ThemeContext
 * để đổi theme toàn app ngay lập tức. Dùng trong màn Settings.
 */
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// ThemeToggleSwitch: công tắc đổi theme.
// Props: không (đọc thẳng theme từ context).
// Trả về: 1 hàng [icon] [tiêu đề + mô tả] [Switch].
// Side effect: gạt Switch -> gọi toggleTheme -> đổi state theme trong ThemeProvider.
export default function ThemeToggleSwitch() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
        {/* Icon đổi theo theme: dark -> mặt trăng, light -> mặt trời */}
        <Ionicons name={isDark ? 'moon' : 'sunny'} size={23} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>Dark Mode</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {/* Phụ đề phản ánh trạng thái hiện tại của theme */}
          {isDark ? 'Dark theme is active' : 'Use a darker color palette'}
        </Text>
      </View>
      <Switch
        accessibilityLabel="Dark Mode"
        ios_backgroundColor={colors.border}
        // onValueChange: khi gạt -> gọi toggleTheme để đảo light <-> dark.
        onValueChange={toggleTheme}
        thumbColor={colors.white}
        trackColor={{ false: colors.border, true: colors.primary }}
        // value gắn với isDark: Switch là controlled, luôn khớp theme thực tế.
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
