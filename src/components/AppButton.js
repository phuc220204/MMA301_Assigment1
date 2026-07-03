/**
 * AppButton.js — Nút bấm dùng chung cho toàn app.
 * Vai trò: gói Pressable + style theo theme, hỗ trợ 2 biến thể (primary/secondary),
 * icon tùy chọn và trạng thái loading/disabled. Dùng ở Home, Profile, EditProfile.
 */
// ActivityIndicator: vòng xoay loading; Pressable: vùng bấm hiện đại (biết được trạng thái pressed).
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// AppButton: nút bấm có thể tái sử dụng.
// Props:
//   - title: chữ hiển thị trên nút (đồng thời là accessibilityLabel).
//   - onPress: callback khi bấm.
//   - variant: 'primary' (nền đậm) hoặc 'secondary' (nền nhạt). Mặc định 'primary'.
//   - icon: tên icon Ionicons hiện bên trái title (tùy chọn).
//   - disabled: khóa nút, mờ đi. Mặc định false.
//   - loading: hiện spinner thay cho nội dung, đồng thời khóa bấm. Mặc định false.
//   - style: style ngoài ghi đè/bổ sung.
// Trả về: 1 Pressable đã style sẵn.
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
}) {
  const { colors } = useTheme();
  // isPrimary: cờ quyết định màu nền/chữ; tránh so sánh chuỗi 'primary' lặp lại nhiều nơi.
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      // accessibility*: giúp trình đọc màn hình đọc đúng "đây là nút" + tên nút.
      accessibilityRole="button"
      accessibilityLabel={title}
      // Đang loading cũng khóa bấm để tránh submit 2 lần liên tiếp.
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          // Màu nền/viền chọn theo variant: primary dùng màu chính, secondary dùng màu nhạt.
          backgroundColor: isPrimary ? colors.primary : colors.primaryLight,
          borderColor: isPrimary ? colors.primary : colors.primaryLight,
          // opacity phản hồi trạng thái: disabled mờ nhất, đang nhấn (pressed) mờ nhẹ, còn lại rõ.
          opacity: disabled ? 0.55 : pressed ? 0.86 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        // Đang loading: hiện spinner, màu tương phản với nền theo variant.
        <ActivityIndicator color={isPrimary ? colors.white : colors.primary} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={21}
              color={isPrimary ? colors.white : colors.primary}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles.label, { color: isPrimary ? colors.white : colors.primary }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// Style tĩnh của nút; màu (phụ thuộc theme + variant) được set động ở trên.
const styles = StyleSheet.create({
  // minHeight 56: nút đủ lớn để dễ bấm; flexDirection:row để icon + chữ nằm ngang, canh giữa.
  button: {
    width: '100%',
    minHeight: 56,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 22,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.15,
  },
  // Khoảng cách giữa icon và chữ.
  icon: {
    marginRight: 10,
  },
});
