import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.textColor }]}>Bem-vindo!</Text>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: theme.buttonBg }]}
          onPress={() => { logout(); navigation.replace('Login'); }}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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


