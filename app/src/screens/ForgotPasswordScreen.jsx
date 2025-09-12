import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDarkMode, toggle } = useTheme();

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    buttonBg: colors.primary,
  }), [colors]);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  // Limpar campos quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      setEmail('');
    }, [])
  );

  async function handleForgot() {
    try {
      if (!email) {
        Alert.alert('Atenção', 'Informe seu email');
        return;
      }

      setLoading(true);
      console.log('API_URL =>', apiUrl);
      await axios.post(`${apiUrl}/auth/forgot`, { email });
      Alert.alert('Sucesso', 'Código de recuperação enviado para seu email!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpar campo após envio bem-sucedido
            setEmail('');
            navigation.navigate('ResetPassword', { email });
          }
        }
      ]);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao solicitar recuperação';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: themed.text }]}>← Voltar</Text>
        </TouchableOpacity>
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
          <Text style={[styles.info, { color: themed.text }]}>Informe seu email para recuperar a senha</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={themed.text + '88'} style={[styles.input, { borderColor: themed.inputBorder, color: themed.text }]} />
          <TouchableOpacity style={[styles.button, { backgroundColor: themed.buttonBg }]} onPress={handleForgot} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
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
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  info: {
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
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


