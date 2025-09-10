import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth();
  const { colors } = useTheme();

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    buttonBg: colors.danger,
  }), [colors]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.text, { color: theme.textColor }]}>Bem-vindo!</Text>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.buttonBg }]}
        onPress={() => { logout(); navigation.replace('Login'); }}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
  },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: '#ff4d4f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});


