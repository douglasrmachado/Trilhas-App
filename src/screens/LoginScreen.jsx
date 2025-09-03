import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  async function handleLogin() {
    try {
      setLoading(true);
      console.log('API_URL =>', apiUrl);
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      if (response?.data?.token) {
        const role = response?.data?.user?.role || 'student';
        login(response.data.token, response.data.user);
        Alert.alert('Sucesso', 'Login realizado com sucesso');
        if (role === 'professor') {
          navigation.replace('ProfessorHome');
        } else {
          navigation.replace('Home');
        }
      }
    } catch (error) {
      console.log('Login error =>', JSON.stringify({
        message: error?.response?.data?.message,
        status: error?.response?.status,
        urlTried: `${apiUrl}/auth/login`,
      }));
      const message = error?.response?.data?.message || error?.message || 'Erro ao realizar login';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/TRILHAS.png')} style={styles.logo} resizeMode="contain" />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
          <Text style={styles.linkText}>Recuperar senha</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
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
  linksRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  linkText: {
    color: '#1e90ff',
  },
});


