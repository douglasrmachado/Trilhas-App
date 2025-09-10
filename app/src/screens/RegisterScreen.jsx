import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registryId, setRegistryId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    buttonBg: colors.primary,
  }), [colors]);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  async function handleRegister() {
    try {
      setLoading(true);
      if (!name || !email || !registryId || !password || !confirmPassword) {
        Alert.alert('Atenção', 'Preencha todos os campos');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Atenção', 'As senhas não conferem');
        return;
      }
      await axios.post(`${apiUrl}/auth/register`, { name, email, registryId, password });
      Alert.alert('Sucesso', 'Cadastro realizado. Faça login.');
      navigation.replace('Login');
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao cadastrar';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themed.background }]}>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
      <TextInput placeholder="N° de matrícula" value={registryId} onChangeText={setRegistryId} autoCapitalize="none" keyboardType="numeric" placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
      <TextInput placeholder="Confirmar senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
      <TouchableOpacity style={[styles.button, { backgroundColor: themed.buttonBg }]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Cadastrar'}</Text>
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


