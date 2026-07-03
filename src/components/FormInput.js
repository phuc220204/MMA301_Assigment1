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
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
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
  field: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 9,
    fontSize: 16,
    fontWeight: '500',
  },
  inputShell: {
    minHeight: 58,
    borderWidth: 1.5,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },
  multilineShell: {
    height: 138,
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    paddingRight: 8,
    fontSize: 17,
  },
  multilineInput: {
    height: '100%',
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
  },
});
