import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function CreateProfessorScreen({ navigation }) {
  const { token } = useAuth();
  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registryId, setRegistryId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/auth/professors`, {
        name,
        email,
        registryId,
        password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Professor criado');
      navigation.goBack();
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao criar professor';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Professor</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Matrícula" value={registryId} onChangeText={setRegistryId} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: { backgroundColor: '#1e90ff', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});


