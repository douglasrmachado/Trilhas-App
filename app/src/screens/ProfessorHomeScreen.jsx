import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfessorHomeScreen({ navigation }) {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área do Professor</Text>
      <Text style={styles.text}>Bem-vindo! Aqui você poderá gerenciar turmas e alunos.</Text>
      <View style={{ height: 16 }} />
      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('CreateProfessor')}>
        <Text style={styles.primaryText}>Criar Professor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => { logout(); navigation.replace('Login'); }}>
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
    padding: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  primaryBtn: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: '#ff4d4f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


