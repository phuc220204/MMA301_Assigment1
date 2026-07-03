/**
 * AppHeader.js — Thanh tiêu đề (header) dùng chung trên đầu mỗi màn.
 * Vai trò: hiển thị tiêu đề ở giữa, kèm nút back bên trái (chỉ khi có onBack).
 * App tự vẽ header này vì navigator đã tắt header mặc định (headerShown:false).
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// AppHeader: header tái sử dụng.
// Props:
//   - title: tiêu đề màn hình.
//   - onBack: callback nút quay lại (thường là navigation.goBack). Nếu KHÔNG truyền -> ẩn nút back.
// Trả về: 1 hàng gồm [vùng trái: nút back] - [tiêu đề] - [vùng phải rỗng để cân giữa].
export default function AppHeader({ title, onBack }) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {/* Chỉ render nút back khi có onBack; màn gốc (Home) không truyền nên không có nút */}
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            // hitSlop: nới rộng vùng nhận chạm thêm 10px quanh nút để dễ bấm hơn.
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

      {/* View rỗng cùng bề rộng với vùng trái để tiêu đề luôn nằm chính giữa */}
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Hàng ngang 3 phần [trái | tiêu đề | phải], canh giữa theo chiều dọc.
  header: {
    minHeight: 72,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  // 2 vùng biên trái/phải cùng bề rộng cố định 44 -> tiêu đề ở giữa luôn cân tuyệt đối.
  side: {
    width: 44,
    alignItems: 'flex-start',
  },
  // Nút back 44x44: đạt kích thước vùng chạm tối thiểu khuyến nghị (~44pt).
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  // flex:1 chiếm trọn phần giữa; kết hợp numberOfLines=1 ở JSX để cắt bớt tiêu đề quá dài.
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 27,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
});
