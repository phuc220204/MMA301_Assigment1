import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

export default function FormInput({ label, error, multiline = false, ...inputProps }) {
  const { colors } = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputShell,
          multiline && styles.multilineShell,
          {
            backgroundColor: colors.input,
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
        {hasError && !multiline ? (
          <Ionicons name="alert-circle-outline" size={25} color={colors.error} />
        ) : null}
      </View>
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
