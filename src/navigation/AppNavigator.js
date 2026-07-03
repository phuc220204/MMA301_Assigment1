/**
 * AppNavigator.js — Cấu hình điều hướng (navigation) của app bằng native stack.
 * Vai trò: khai báo 4 màn (Home, Profile, EditProfile, Settings) và đồng bộ màu của
 * React Navigation với theme hiện tại. Mỗi screen nhận prop 'navigation' để chuyển màn.
 */
import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../context/ThemeContext';
import EditProfileScreen from '../screens/EditProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Tạo bộ Navigator dạng stack một lần ở ngoài component (không tạo lại mỗi lần render).
const Stack = createNativeStackNavigator();

// AppNavigator: component dựng toàn bộ cây điều hướng.
// Props: không. Trả về: NavigationContainer chứa Stack.Navigator với các Stack.Screen.
export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  // navigationTheme: map bảng colors của app sang đúng schema theme mà React Navigation yêu cầu.
  // useMemo: chỉ dựng lại theme khi colors/isDark đổi (vd khi bật/tắt dark mode).
  const navigationTheme = useMemo(
    () => ({
      dark: isDark,
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        notification: colors.error,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }),
    [colors, isDark]
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      {/* initialRouteName='Home': màn đầu tiên khi mở app. headerShown:false vì app tự vẽ AppHeader. */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        {/* Mỗi Stack.Screen khai báo 1 route: 'name' là tên dùng cho navigation.navigate(name) */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
