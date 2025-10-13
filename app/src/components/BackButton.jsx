import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function BackButton({ onPress, text = 'Voltar' }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.backButton,
        {
          backgroundColor: isDarkMode ? 'rgba(30, 144, 255, 0.12)' : 'rgba(30, 144, 255, 0.08)',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={styles.backIcon}>←</Text>
      <Text style={[styles.backText, { color: '#1e90ff' }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e90ff',
  },
});

