/**
 * SettingsScreen.js — Màn cài đặt (route 'Settings').
 * Vai trò: cho bật/tắt Dark Mode qua ThemeToggleSwitch và xem trước (preview) màu của theme
 * đang chọn. Mọi thay đổi theme phản ánh tức thì nhờ Context API.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Ionicons: bộ icon có sẵn của Expo (dùng icon moon/sunny cho khối preview).
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import ThemeToggleSwitch from '../components/ThemeToggleSwitch';
import { useTheme } from '../context/ThemeContext';

// SettingsScreen: màn cài đặt giao diện.
// Props: navigation — dùng goBack() cho nút back trên header.
// Trả về: khu vực bật Dark Mode + khu vực preview theme.
export default function SettingsScreen({ navigation }) {
  // colors: bảng màu hiện tại; isDark: cờ để đổi icon/nhãn của khối preview theo theme.
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <ThemeToggleSwitch />
        </View>

        <Text style={[styles.sectionLabel, styles.previewLabel, { color: colors.textSecondary }]}>THEME PREVIEW</Text>
        <View style={[styles.card, styles.previewCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={[styles.previewIcon, { backgroundColor: colors.primaryLight }]}>
            {/* Icon preview đổi theo theme: dark -> mặt trăng, light -> mặt trời */}
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={32} color={colors.primary} />
          </View>
          <Text style={[styles.previewTitle, { color: colors.text }]}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text style={[styles.previewText, { color: colors.textSecondary }]}>
            This preview updates instantly across every screen in the app.
          </Text>
          <View style={styles.swatches}>
            {/* Render 4 ô màu mẫu từ theme hiện tại; key ghép color+index để chắc chắn duy nhất kể cả khi trùng màu */}
            {[colors.primary, colors.primaryLight, colors.background, colors.border].map((color, index) => (
              <View
                key={`${color}-${index}`}
                style={[styles.swatch, { backgroundColor: color, borderColor: colors.border }]}
              />
            ))}
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>Theme managed with Context API</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Style tĩnh; màu theo theme được truyền động trong JSX.
const styles = StyleSheet.create({
  // Chiếm trọn màn hình.
  safeArea: {
    flex: 1,
  },
  // flexGrow:1 để footer có thể bám xuống đáy; maxWidth cho responsive màn rộng.
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  // Nhãn nhóm kiểu chữ IN HOA nhỏ, giãn ký tự (letterSpacing) theo phong cách màn settings quen thuộc.
  sectionLabel: {
    marginLeft: 6,
    marginBottom: 9,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  // Nhãn THEME PREVIEW cần cách khối Appearance phía trên.
  previewLabel: {
    marginTop: 28,
  },
  // Card bo tròn + bóng đổ (shadow* cho iOS, elevation cho Android).
  card: {
    borderRadius: 28,
    padding: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  // Card preview: nội dung xếp dọc, canh giữa.
  previewCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  // Ô vuông bo tròn chứa icon mặt trời/mặt trăng, icon nằm chính giữa.
  previewIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    marginTop: 17,
    fontSize: 22,
    fontWeight: '800',
  },
  // maxWidth giữ đoạn mô tả không quá dài, dễ đọc.
  previewText: {
    maxWidth: 360,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  // Hàng 4 ô màu mẫu; gap tạo khoảng cách đều giữa các ô.
  swatches: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  // Mỗi ô màu: hình tròn nhỏ có viền — nhờ viền mà ô trùng màu nền vẫn nhìn thấy được.
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
  },
  // flex:1 + textAlignVertical:bottom: chữ footer bám xuống đáy vùng còn trống.
  footer: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    paddingTop: 42,
    fontSize: 13,
  },
});
