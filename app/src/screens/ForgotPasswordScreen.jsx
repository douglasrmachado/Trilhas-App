import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    buttonBg: colors.primary,
  }), [colors]);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  async function handleForgot() {
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/auth/forgot`, { email });
      Alert.alert('Sucesso', 'Se existir, enviaremos instruções ao email.');
      navigation.goBack();
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao solicitar recuperação';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themed.background }]}>
      <Text style={[styles.info, { color: themed.text }]}>Informe seu email para recuperar a senha</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
      <TouchableOpacity style={[styles.button, { backgroundColor: themed.buttonBg }]} onPress={handleForgot} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  info: {
    marginBottom: 12,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


