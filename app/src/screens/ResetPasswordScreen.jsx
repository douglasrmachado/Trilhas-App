import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import PasswordInput from '../components/PasswordInput';

export default function ResetPasswordScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { colors, isDarkMode } = useTheme();
  const { email } = route.params || {};

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    buttonBg: colors.primary,
    link: '#1e90ff',
  }), [colors]);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  // Limpar campos quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    }, [])
  );

  async function handleResetPassword() {
    try {
      if (!code || !newPassword || !confirmPassword) {
        Alert.alert('Atenção', 'Preencha todos os campos');
        return;
      }

      if (code.length !== 6) {
        Alert.alert('Erro', 'O código deve ter 6 dígitos');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
        return;
      }

      setLoading(true);
      console.log('API_URL =>', apiUrl);
      
      const response = await axios.post(`${apiUrl}/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      
      Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpar campos após sucesso
            setCode('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.navigate('Login');
          }
        }
      ]);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        Alert.alert('Erro', 'Código inválido ou expirado');
      } else {
        Alert.alert('Erro', 'Erro ao redefinir senha');
      }
      console.error('Erro ao redefinir senha:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    try {
      if (!email) {
        Alert.alert('Erro', 'Email não encontrado');
        return;
      }

      setLoading(true);
      console.log('API_URL =>', apiUrl);
      
      await axios.post(`${apiUrl}/auth/forgot`, { email });
      Alert.alert('Sucesso', 'Novo código enviado para seu email!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao reenviar código');
      console.error('Erro ao reenviar código:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
              <Image source={require('../../assets/TRILHAS.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={[styles.appTitle, { color: themed.text }]}>Redefinir Senha</Text>
            <Text style={[styles.appSubtitle, { color: themed.text + '88' }]}>Digite o código enviado para seu email</Text>
          </View>

          {/* Card Section */}
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e293b' : '#fff', shadowColor: themed.text }]}>
            <View style={[styles.formContent, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
              <Text style={[styles.formTitle, { color: themed.text }]}>Código de Verificação</Text>
              <Text style={[styles.formSubtitle, { color: themed.text + '88' }]}>
                Enviamos um código de 6 dígitos para: {email}
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themed.text }]}>Código de Verificação</Text>
                <TextInput
                  placeholder="123456"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor={themed.text + '66'}
                  style={[styles.input, styles.codeInput, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themed.text }]}>Nova Senha</Text>
                <PasswordInput
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={themed.text + '66'}
                  style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themed.text }]}>Confirmar Nova Senha</Text>
                <PasswordInput
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor={themed.text + '66'}
                  style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                />
              </View>

              <TouchableOpacity 
                style={[styles.resetButton, { backgroundColor: '#1e90ff' }]} 
                onPress={handleResetPassword} 
                disabled={loading}
              >
                <Text style={styles.resetButtonText}>{loading ? 'Redefinindo...' : 'Redefinir Senha'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton} 
                onPress={handleResendCode}
                disabled={loading}
              >
                <Text style={[styles.resendButtonText, { color: themed.link }]}>
                  Não recebeu o código? Reenviar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 90,
    height: 90,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  formContent: {
    padding: 24,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  resetButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
