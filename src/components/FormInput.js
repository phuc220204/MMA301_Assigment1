/**
 * FormInput.js — Ô nhập liệu có label và thông báo lỗi, dùng chung cho form.
 * Vai trò: bọc TextInput, đổi màu viền khi có lỗi và hiện icon/dòng lỗi. Dùng ở EditProfile.
 */
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// FormInput: trường nhập liệu tái sử dụng.
// Props:
//   - label: nhãn hiển thị phía trên ô nhập.
//   - error: chuỗi lỗi; có giá trị -> bật trạng thái lỗi (viền đỏ + dòng lỗi).
//   - multiline: ô nhiều dòng (vd Bio). Mặc định false.
//   - ...inputProps: các prop còn lại (value, onChangeText, onBlur, placeholder...) chuyển thẳng cho TextInput.
// Trả về: cụm [label] + [khung input] + [dòng lỗi nếu có].
export default function FormInput({ label, error, multiline = false, ...inputProps }) {
  const { colors } = useTheme();
  // hasError: ép error (có thể là string/undefined) về boolean để quyết định cách hiển thị.
  const hasError = Boolean(error);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputShell,
          // Áp thêm style cho ô nhiều dòng khi multiline = true.
          multiline && styles.multilineShell,
          {
            backgroundColor: colors.input,
            // Viền đỏ khi có lỗi, ngược lại dùng màu viền thường.
            borderColor: hasError ? colors.error : colors.border,
          },
        ]}
      >
        <TextInput
          {...inputProps}
          // Tắt tự viết hoa/tự sửa chữ: giữ nguyên text người dùng gõ, nhập liệu ổn định
          // (đặc biệt khi gõ tiếng Việt có quá trình ghép dấu).
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
          // Màu placeholder + màu con trỏ/vùng bôi đen lấy theo theme.
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            { color: colors.text },
          ]}
        />
        {/* Icon cảnh báo chỉ hiện khi có lỗi và là ô 1 dòng (ô nhiều dòng không đủ chỗ canh icon) */}
        {hasError && !multiline ? (
          <Ionicons name="alert-circle-outline" size={25} color={colors.error} />
        ) : null}
      </View>
      {/* Dòng mô tả lỗi nằm dưới ô nhập, chỉ hiện khi có error */}
      {hasError ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Cả cụm field chiếm hết bề ngang, cách field kế tiếp 20px.
  field: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 9,
    fontSize: 16,
    fontWeight: '500',
  },
  // Khung bao input: flexDirection:row để đặt TextInput và icon lỗi nằm cạnh nhau.
  inputShell: {
    minHeight: 58,
    borderWidth: 1.5,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },
  // Biến thể nhiều dòng: cao cố định, nội dung bám mép trên thay vì canh giữa.
  multilineShell: {
    height: 138,
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  // flex:1 chiếm hết chỗ trống trong khung; minWidth:0 cho phép co lại khi icon lỗi xuất hiện.
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    paddingRight: 8,
    fontSize: 17,
  },
  // textAlignVertical:'top': chữ bắt đầu từ mép trên của ô nhiều dòng (cần cho Android).
  multilineInput: {
    height: '100%',
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  // Dòng mô tả lỗi màu đỏ nằm dưới ô nhập.
  error: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
  },
});
