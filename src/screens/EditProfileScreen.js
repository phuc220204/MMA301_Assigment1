/**
 * EditProfileScreen.js — Màn chỉnh sửa profile (route 'EditProfile').
 * Vai trò: dùng Formik quản lý form + Yup để validate name/bio; khi lưu hợp lệ thì gọi
 * updateProfile (ProfileContext) rồi quay lại màn trước. KeyboardAvoidingView tránh bàn phím che ô nhập.
 */
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AppButton from '../components/AppButton';
import AppHeader from '../components/AppHeader';
import Avatar from '../components/Avatar';
import FormInput from '../components/FormInput';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

// profileSchema: quy tắc validate của Yup cho form (định nghĩa ngoài component để khỏi tạo lại mỗi render).
// Dùng .test() tự viết thay cho .required()/.min() để kiểm tra trên giá trị đã trim (loại khoảng trắng thừa).
const profileSchema = Yup.object({
  name: Yup.string()
    // name bắt buộc: rỗng hoặc toàn khoảng trắng -> lỗi 'Name is required.'
    .test('name-required', 'Name is required.', (value) => Boolean(value?.trim().length))
    .test(
      'name-min-length',
      'Name must be at least 2 characters.',
      // Chỉ kiểm tra độ dài tối thiểu khi name có nhập (rỗng đã do rule trên xử lý) -> tránh báo 2 lỗi cùng lúc.
      (value) => !value?.trim().length || value.trim().length >= 2
    ),
  // bio bắt buộc: rỗng hoặc toàn khoảng trắng -> lỗi 'Bio is required.'
  bio: Yup.string().test(
    'bio-required',
    'Bio is required.',
    (value) => Boolean(value?.trim().length)
  ),
});

// EditProfileScreen: màn sửa profile.
// Props: navigation — dùng goBack() để đóng màn sau khi lưu/hủy.
// Trả về: form Formik gồm 2 ô (Name, Bio) và 2 nút (Save Changes, Cancel).
export default function EditProfileScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Edit Profile" onBack={navigation.goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}
      >
        <Formik
          // initialValues: nạp giá trị hiện tại của profile vào form làm điểm xuất phát.
          initialValues={{ name: profile.name, bio: profile.bio }}
          // Chỉ validate khi rời ô (onBlur), không validate mỗi lần gõ -> đỡ làm phiền khi đang nhập.
          validateOnBlur
          validateOnChange={false}
          validationSchema={profileSchema}
          // onSubmit chỉ chạy khi dữ liệu hợp lệ: lưu profile (đã trim), tắt cờ submitting rồi quay lại.
          onSubmit={(values, { setSubmitting }) => {
            updateProfile({ name: values.name.trim(), bio: values.bio.trim() });
            setSubmitting(false);
            navigation.goBack();
          }}
        >
          {/* Render-props của Formik: lấy các handler/state để gắn vào UI:
              - errors: map lỗi theo field (do validationSchema sinh ra)
              - handleBlur: báo Formik 1 field đã được chạm/rời (đánh dấu touched)
              - handleChange: cập nhật values khi gõ
              - handleSubmit: chạy validate rồi gọi onSubmit nếu hợp lệ
              - isSubmitting: cờ đang submit -> dùng cho loading của nút Save
              - touched: field nào đã được chạm -> để chỉ hiện lỗi sau khi người dùng tương tác
              - values: giá trị hiện tại của form */}
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.card, shadowColor: colors.shadow },
                ]}
              >
                <View style={styles.intro}>
                  <Avatar source={profile.avatar} size={74} subtle />
                  <View style={styles.introCopy}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Update your information</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                      Keep your profile fresh and up to date.
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Ô Name: chỉ truyền error khi field đã touched -> tránh báo lỗi khi vừa mở form */}
                <FormInput
                  error={touched.name ? errors.name : undefined}
                  label="Name"
                  onBlur={handleBlur('name')}
                  onChangeText={handleChange('name')}
                  placeholder="Enter your name"
                  returnKeyType="next"
                  value={values.name}
                />
                {/* Ô Bio: nhiều dòng, giới hạn 220 ký tự; cùng cơ chế touched/errors như trên */}
                <FormInput
                  error={touched.bio ? errors.bio : undefined}
                  label="Bio"
                  maxLength={220}
                  multiline
                  onBlur={handleBlur('bio')}
                  onChangeText={handleChange('bio')}
                  placeholder="Tell us about yourself"
                  value={values.bio}
                />
              </View>

              <View style={styles.actions}>
                {/* Save: gọi handleSubmit (Formik tự validate trước); loading hiện spinner khi đang submit */}
                <AppButton loading={isSubmitting} title="Save Changes" onPress={handleSubmit} />
                {/* Cancel: bỏ thay đổi, quay lại màn trước mà không lưu */}
                <AppButton title="Cancel" variant="secondary" onPress={navigation.goBack} style={styles.cancel} />
              </View>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 3,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introCopy: {
    flex: 1,
    marginLeft: 18,
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 15,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    marginTop: 22,
    marginBottom: 24,
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 34,
  },
  cancel: {
    marginTop: 12,
  },
});
