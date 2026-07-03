/**
 * colors.js — Bảng màu (design tokens) cho 2 theme light & dark.
 * Vai trò: tập trung toàn bộ mã màu một chỗ; ThemeContext chọn 1 trong 2 bảng này
 * theo themeMode rồi phát xuống app qua colors. Đổi màu app chỉ cần sửa ở đây.
 * Hai object PHẢI có cùng tập key để mọi component tham chiếu colors.<key> luôn hợp lệ.
 */
export const lightColors = {
  background: '#FCF6FF', // Nền chung của mọi màn hình (tím rất nhạt).
  card: '#FFFFFF', // Nền các thẻ (card) nổi trên background.
  text: '#111827', // Màu chữ chính (tiêu đề, tên, nội dung quan trọng).
  textSecondary: '#6B7280', // Màu chữ phụ (mô tả, phụ đề, footer).
  primary: '#6D0FEF', // Màu chủ đạo (tím) cho nút primary, icon, viền avatar.
  primaryLight: '#EDE2FF', // Bản nhạt của màu chủ đạo: nền nút secondary, ô icon, tag.
  error: '#DC2626', // Màu báo lỗi (viền + chữ lỗi của form).
  border: '#E8DFF0', // Màu viền input, đường kẻ phân cách, viền ô màu preview.
  input: '#FFFFFF', // Nền của ô nhập liệu.
  shadow: '#7C3AED', // Màu bóng đổ của card (ánh tím nhẹ hợp theme sáng).
  white: '#FFFFFF', // Trắng cố định: chữ/spinner trên nút primary, thumb của Switch.
};

// Cùng tập key với lightColors nhưng giá trị đảo sáng/tối; ThemeContext chỉ việc swap 2 object này.
export const darkColors = {
  background: '#111827', // Nền tối (xám đen) thay cho tím nhạt.
  card: '#1F2937', // Card xám đậm, sáng hơn nền một bậc để vẫn thấy khối nổi.
  text: '#F9FAFB', // Chữ chính gần trắng để tương phản trên nền tối.
  textSecondary: '#9CA3AF', // Chữ phụ xám sáng.
  primary: '#A78BFA', // Tím sáng hơn bản light để nổi bật trên nền tối.
  primaryLight: '#312E4F', // "Tím nhạt" phiên bản tối: nền tag, ô icon, nút secondary.
  error: '#F87171', // Đỏ sáng hơn để đọc được trên nền tối.
  border: '#374151', // Viền xám đậm.
  input: '#111827', // Nền input trùng màu nền app để chìm vào card tối.
  shadow: '#000000', // Bóng đen thuần cho theme tối.
  white: '#FFFFFF', // Trắng cố định (không đổi theo theme).
};
