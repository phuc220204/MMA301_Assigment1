/**
 * App.js — Root component của ứng dụng.
 * Vai trò: dựng cây Provider (SafeArea, Theme, Profile) bao toàn app rồi render AppNavigator.
 * Đây là nơi khởi tạo "global state" cho theme và profile mà mọi screen dùng chung.
 */
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { ProfileProvider } from './src/context/ProfileContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

// AppContent: tách riêng để nằm BÊN TRONG ThemeProvider, nhờ vậy mới gọi được useTheme().
// Nhiệm vụ: đọc theme hiện tại để chỉnh màu StatusBar, rồi render navigator.
// Props: không. Trả về: StatusBar + AppNavigator.
function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      {/* Chữ/icon trên thanh status đổi theo theme: dark theme -> dùng style 'light' cho dễ đọc */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

// App: component gốc (export default) — entry component của toàn app.
// Nhiệm vụ: xếp Provider theo thứ tự SafeAreaProvider > ThemeProvider > ProfileProvider
// để mọi screen con đều truy cập được theme + profile qua context.
// Props: không. Trả về: cây UI gốc.
export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {/* ThemeProvider phải bọc AppContent thì useTheme() bên trong mới hoạt động */}
      <ThemeProvider>
        <ProfileProvider>
          <AppContent />
        </ProfileProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
