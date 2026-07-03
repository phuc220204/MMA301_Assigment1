/**
 * HomeScreen.js — Màn hình chính (route 'Home').
 * Vai trò: chào người dùng bằng ProfileCard bản gọn và 1 nút điều hướng sang màn Profile.
 */
// Component cơ bản của React Native: ScrollView (vùng cuộn), StyleSheet (khai báo style),
// Text (chữ), View (khối bố cục).
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// SafeAreaView bản của safe-area-context: tự chừa chỗ cho status bar/tai thỏ
// theo số đo do SafeAreaProvider (App.js) cung cấp.
import { SafeAreaView } from 'react-native-safe-area-context';

// Component tái sử dụng + custom hook đọc dữ liệu từ 2 context dùng chung.
import AppButton from '../components/AppButton';
import AppHeader from '../components/AppHeader';
import ProfileCard from '../components/ProfileCard';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

// HomeScreen: màn chính.
// Props: navigation — do React Navigation truyền vào, dùng để chuyển màn.
// Trả về: layout chào mừng + nút "View My Profile".
export default function HomeScreen({ navigation }) {
  // Đọc state dùng chung từ context: profile để hiển thị, colors để style theo theme hiện tại.
  const { profile } = useProfile();
  const { colors } = useTheme();

  return (
    // edges: áp safe area đủ 4 cạnh. style dạng mảng = style tĩnh + màu nền động theo theme.
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Profile App" />
      {/* bounces=false: tắt hiệu ứng kéo nảy (iOS); ẩn thanh cuộn dọc cho giao diện gọn */}
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerArea}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <ProfileCard compact profile={profile} />
            {/* Bấm nút -> navigation.navigate('Profile') chuyển sang màn Profile */}
            <AppButton
              title="View My Profile"
              onPress={() => navigation.navigate('Profile')}
              style={styles.cardButton}
            />
          </View>
        </View>
        <Text style={[styles.footer, { color: colors.textSecondary }]}>Assignment 1 • React Native</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet.create: khai báo style 1 lần ngoài component (không tạo lại mỗi render).
// Lưu ý: màu sắc KHÔNG đặt cứng ở đây vì phụ thuộc theme — chúng được truyền động qua style mảng ở JSX.
const styles = StyleSheet.create({
  // flex:1 để SafeAreaView chiếm trọn màn hình.
  safeArea: {
    flex: 1,
  },
  // Khung nội dung cuộn: flexGrow:1 cho phép giãn hết chiều cao còn lại;
  // maxWidth + alignSelf:center để nội dung không quá bè trên màn hình rộng/tablet (responsive).
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  // Vùng giữa: flex:1 + justifyContent:center đẩy card vào chính giữa màn theo chiều dọc.
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 26,
  },
  // Card bo tròn có bóng đổ: nhóm shadow* dành cho iOS, elevation dành cho Android
  // (2 nền tảng dùng 2 hệ bóng khác nhau nên phải khai báo cả hai).
  card: {
    width: '100%',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  // Khoảng cách giữa nút và phần nội dung card phía trên.
  cardButton: {
    marginTop: 28,
  },
  // Dòng chữ nhỏ cuối màn hình, căn giữa.
  footer: {
    paddingTop: 14,
    textAlign: 'center',
    fontSize: 14,
  },
});
