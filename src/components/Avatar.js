import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

export default function Avatar({ source, size = 116, subtle = false }) {
  const { colors } = useTheme();
  const borderWidth = subtle ? 4 : 5;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: subtle ? colors.primaryLight : colors.primary,
          backgroundColor: colors.primaryLight,
        },
      ]}
    >
      {source ? (
        <Image source={source} resizeMode="cover" style={styles.image} />
      ) : (
        <Ionicons name="person" size={size * 0.64} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
