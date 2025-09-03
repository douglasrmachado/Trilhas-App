import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registryId, setRegistryId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <View style={styles.container}>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="N° de matrícula" value={registryId} onChangeText={setRegistryId} autoCapitalize="none" keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirmar senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
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


