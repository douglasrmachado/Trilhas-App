import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import PasswordInput from '../components/PasswordInput';
import BackButton from '../components/BackButton';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registryId, setRegistryId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDarkMode, toggle } = useTheme();

  // Função para permitir apenas letras e números na matrícula
  const handleRegistryIdChange = (text) => {
    // Remove caracteres especiais, mantém apenas letras e números
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, '');
    setRegistryId(cleaned.toUpperCase());
  };

  const courses = ['Informática', 'Meio Ambiente', 'Produção Cultural', 'Mecânica'];

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    buttonBg: colors.primary,
  }), [colors]);

  // Detecta se está rodando no web e usa localhost
  const apiUrl = Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : (Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000');

  async function handleRegister() {
    try {
      setLoading(true);
      console.log('🔍 Dados do formulário:', { name, email, registryId, course });
      
      if (!name || !email || !registryId || !password || !confirmPassword || !course) {
        Alert.alert('Atenção', 'Preencha todos os campos, incluindo o curso');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Atenção', 'As senhas não conferem');
        return;
      }
      
      console.log('📤 Enviando cadastro com curso:', course);
      await axios.post(`${apiUrl}/auth/register`, { name, email, registryId, password, course });
      Alert.alert('Sucesso', 'Cadastro realizado. Faça login.');
      navigation.replace('Login');
    } catch (error) {
      console.error('❌ Erro ao cadastrar:', error);
      console.error('📋 Detalhes da resposta:', error?.response?.data);
      console.error('📊 Status:', error?.response?.status);
      
      const message = error?.response?.data?.message || 'Erro ao cadastrar';
      const details = error?.response?.data?.stack ? `\n\nDetalhes: ${error.response.data.stack}` : '';
      Alert.alert('Erro ao cadastrar', message + details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: themed.text + '20' }]}
          onPress={() => toggle()}
        >
          <Text style={styles.themeIcon}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
          <Text style={[styles.themeText, { color: themed.text }]}>
            {isDarkMode ? 'Claro' : 'Escuro'}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TextInput placeholder="Nome" value={name} onChangeText={setName} placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
          <TextInput 
            placeholder="N° de matrícula (letras e números)" 
            value={registryId} 
            onChangeText={handleRegistryIdChange} 
            autoCapitalize="characters" 
            placeholderTextColor={themed.text + '88'} 
            style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} 
          />
          
          {/* Seletor de Curso */}
          <View style={styles.courseContainer}>
            <Text style={[styles.courseLabel, { color: themed.text }]}>Selecione seu curso:</Text>
            <View style={styles.coursesGrid}>
              {courses.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.courseButton,
                    { 
                      borderColor: course === c ? themed.buttonBg : themed.inputBorder,
                      backgroundColor: course === c ? themed.buttonBg + '20' : 'transparent'
                    }
                  ]}
                  onPress={() => setCourse(c)}
                >
                  <Text style={[
                    styles.courseButtonText,
                    { color: course === c ? themed.buttonBg : themed.text }
                  ]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PasswordInput placeholder="Senha" value={password} onChangeText={setPassword} placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
          <PasswordInput placeholder="Confirmar senha" value={confirmPassword} onChangeText={setConfirmPassword} placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
          <TouchableOpacity style={[styles.button, { backgroundColor: themed.buttonBg }]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  themeButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.1)',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 28,
    marginBottom: 2,
  },
  themeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
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
  courseContainer: {
    width: '100%',
    marginBottom: 16,
  },
  courseLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  courseButton: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});


