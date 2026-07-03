/**
 * Avatar.js — Ảnh đại diện hình tròn dùng chung.
 * Vai trò: hiển thị ảnh profile bo tròn; nếu không có ảnh thì hiện icon người mặc định.
 */
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// Avatar: khung avatar tròn.
// Props:
//   - source: nguồn ảnh (kiểu Image source). Không có -> hiện icon 'person'.
//   - size: đường kính (px). Mặc định 116.
//   - subtle: kiểu viền nhẹ hơn (mỏng + màu nhạt) dùng cho ngữ cảnh phụ. Mặc định false.
// Trả về: 1 View tròn chứa ảnh hoặc icon.
export default function Avatar({ source, size = 116, subtle = false }) {
  const { colors } = useTheme();
  // Viền: subtle -> mỏng (4) màu nhạt; bình thường -> dày (5) màu chính. Tạo độ nổi bật khác nhau.
  const borderWidth = subtle ? 4 : 5;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          // borderRadius = nửa cạnh -> hình vuông thành hình tròn hoàn hảo.
          borderRadius: size / 2,
          borderWidth,
          borderColor: subtle ? colors.primaryLight : colors.primary,
          backgroundColor: colors.primaryLight,
        },
      ]}
    >
      {source ? (
        <Image source={source} resizeMode="cover" style={styles.image} />
      ) : (
        // Fallback khi thiếu ảnh: icon người, cỡ ~64% đường kính cho cân đối.
        <Ionicons name="person" size={size * 0.64} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
