import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ContactScreen({ navigation }) {
  const { colors, isDarkMode, toggle } = useTheme();

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    buttonBg: colors.primary,
  }), [colors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: themed.text }]}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: isDarkMode ? themed.text + '20' : 'rgba(0,0,0,0.05)' }]}
          onPress={() => toggle()}
        >
          <Text style={styles.themeIcon}>
            {isDarkMode ? '☀' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
            <Image source={require('../../assets/TRILHAS.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={[styles.title, { color: themed.text }]}>Recuperação de Senha</Text>
        </View>

        {/* Message Card */}
        <View style={[styles.messageCard, { backgroundColor: isDarkMode ? '#1e293b' : '#fff', shadowColor: themed.text }]}>
          <View style={[styles.messageContent, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
            <Text style={[styles.messageIcon, { color: '#FFA500' }]}>⚠️</Text>
            <Text style={[styles.messageTitle, { color: themed.text }]}>Esqueceu sua senha?</Text>
            <Text style={[styles.messageText, { color: themed.text + '88' }]}>
              Em caso de perda de senha, é necessário entrar em contato com a coordenação/secretaria da instituição para redefinir seu acesso.
            </Text>
            <View style={[styles.contactInfoContainer, { backgroundColor: isDarkMode ? '#334155' : '#f8f9fa' }]}>
              <Text style={[styles.contactInfo, { color: themed.text + '66' }]}>
                📞 Telefone: (11) 1234-5678{'\n'}
                📧 Email: secretaria@instituicao.edu.br{'\n'}
                🏢 Horário: Segunda a Sexta, 8h às 17h
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: themed.buttonBg }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  themeButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.1)',
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  themeIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageCard: {
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    marginBottom: 30,
    width: '100%',
  },
  messageContent: {
    padding: 30,
    alignItems: 'center',
  },
  messageIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  contactInfoContainer: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 8,
  },
  contactInfo: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
