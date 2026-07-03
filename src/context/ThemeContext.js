/**
 * ThemeContext.js — Quản lý theme (light/dark) toàn app bằng Context API.
 * Vai trò: cung cấp themeMode, isDark, bảng colors hiện tại và hàm toggleTheme
 * cho mọi component con thông qua hook useTheme().
 */
import { createContext, useContext, useMemo, useState } from 'react';

import { darkColors, lightColors } from '../theme/colors';

// Context khởi tạo undefined để useTheme() phát hiện được khi bị dùng ngoài Provider.
const ThemeContext = createContext(undefined);

// ThemeProvider: bọc cây con và cấp giá trị theme xuống qua Provider.
// Props: children — phần UI được bao bên trong.
// Trả về: <ThemeContext.Provider> chứa state theme.
export function ThemeProvider({ children }) {
  // themeMode là nguồn sự thật ('light' | 'dark'); isDark là cờ tiện dụng suy ra từ nó.
  const [themeMode, setThemeMode] = useState('light');
  const isDark = themeMode === 'dark';

  // useMemo: chỉ tạo lại object value khi isDark/themeMode đổi -> tránh re-render thừa cho consumer.
  const value = useMemo(
    () => ({
      themeMode,
      isDark,
      // Chọn bảng màu theo theme: dark -> darkColors, ngược lại lightColors.
      colors: isDark ? darkColors : lightColors,
      // toggleTheme dùng updater function: đọc 'current' rồi đảo light <-> dark, không phụ thuộc closure cũ.
      toggleTheme: () => setThemeMode((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [isDark, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// useTheme: custom hook để đọc theme từ context.
// Tham số: không.
// Trả về: object { themeMode, isDark, colors, toggleTheme }.
// Side effect: ném Error nếu gọi bên ngoài ThemeProvider (giúp bắt lỗi sớm).
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
}
