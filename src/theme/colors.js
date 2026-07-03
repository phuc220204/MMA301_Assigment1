/**
 * colors.js — Bảng màu (design tokens) cho 2 theme light & dark.
 * Vai trò: tập trung toàn bộ mã màu một chỗ; ThemeContext chọn 1 trong 2 bảng này
 * theo themeMode rồi phát xuống app qua colors. Đổi màu app chỉ cần sửa ở đây.
 * Hai object PHẢI có cùng tập key để mọi component tham chiếu colors.<key> luôn hợp lệ.
 */
export const lightColors = {
  background: '#FCF6FF',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  primary: '#6D0FEF',
  primaryLight: '#EDE2FF',
  error: '#DC2626',
  border: '#E8DFF0',
  input: '#FFFFFF',
  shadow: '#7C3AED',
  white: '#FFFFFF',
};

export const darkColors = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  primary: '#A78BFA',
  primaryLight: '#312E4F',
  error: '#F87171',
  border: '#374151',
  input: '#111827',
  shadow: '#000000',
  white: '#FFFFFF',
};
