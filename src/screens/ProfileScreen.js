/**
 * ProfileScreen.js — Màn xem profile đầy đủ (route 'Profile').
 * Vai trò: hiển thị ProfileCard bản đầy đủ và 2 nút điều hướng sang EditProfile và Settings.
 */
// ScrollView (vùng cuộn), StyleSheet (khai báo style), View (khối bố cục).
import { ScrollView, StyleSheet, View } from 'react-native';
// SafeAreaView: tự chừa vùng status bar/tai thỏ.
import { SafeAreaView } from 'react-native-safe-area-context';

// Component tái sử dụng + custom hook đọc context.
import AppButton from '../components/AppButton';
import AppHeader from '../components/AppHeader';
import ProfileCard from '../components/ProfileCard';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

// ProfileScreen: màn chi tiết profile.
// Props: navigation — dùng để chuyển sang màn EditProfile/Settings.
// Trả về: thẻ profile + 2 nút hành động.
export default function ProfileScreen({ navigation }) {
  // profile: dữ liệu từ ProfileContext — màn này là consumer nên TỰ re-render khi Edit lưu xong.
  // colors: bảng màu theo theme hiện tại.
  const { profile } = useProfile();
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="My Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <ProfileCard profile={profile} />
        </View>

        {/* navigate('EditProfile'): mở màn chỉnh sửa profile */}
        <AppButton
          icon="create-outline"
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.firstButton}
        />
        {/* navigate('Settings'): mở màn cài đặt (đổi theme) */}
        <AppButton
          icon="settings-outline"
          title="Settings"
          variant="secondary"
          onPress={() => navigation.navigate('Settings')}
          style={styles.secondButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Style tĩnh; màu theo theme được truyền động qua style mảng trong JSX.
const styles = StyleSheet.create({
  // Chiếm trọn màn hình.
  safeArea: {
    flex: 1,
  },
  // Giới hạn bề rộng nội dung (responsive trên màn rộng) và canh giữa.
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  // Card bo tròn + bóng đổ (shadow* cho iOS, elevation cho Android).
  card: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 28,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 22,
    elevation: 4,
  },
  // Khoảng cách nút Edit với card phía trên.
  firstButton: {
    marginTop: 30,
  },
  // Khoảng cách giữa 2 nút.
  secondButton: {
    marginTop: 14,
  },
});
