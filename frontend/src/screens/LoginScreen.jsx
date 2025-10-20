import React, { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PasswordInput from '../components/PasswordInput';
import OptimizedImage from '../components/OptimizedImage';

const LoginScreen = memo(function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Estados para cadastro
  const [name, setName] = useState('');
  const [registryId, setRegistryId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [course, setCourse] = useState('');
  
  const courses = ['Informática', 'Meio Ambiente', 'Produção Cultural', 'Mecânica'];
  
  const { login } = useAuth();
  const { colors, isDarkMode, toggle } = useTheme();

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    buttonBg: colors.primary,
    link: '#1e90ff',
  }), [colors]);

  // Detecta se está rodando no web e usa localhost
  const apiUrl = Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : (Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000');

  // Limpar campos quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setName('');
      setRegistryId('');
      setConfirmPassword('');
      setCourse('');
      setActiveTab('login');
    }, [])
  );

  // Limpar campos quando mudar de tab
  useEffect(() => {
    if (activeTab === 'login') {
      setName('');
      setRegistryId('');
      setConfirmPassword('');
      setCourse('');
    } else if (activeTab === 'register') {
      setPassword('');
    }
  }, [activeTab]);

  const handleLogin = useCallback(async () => {
    try {
      if (!email || !password) {
        Alert.alert('Atenção', 'Preencha todos os campos');
        return;
      }
      setLoading(true);
      console.log('API_URL =>', apiUrl);
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      console.log('📡 Resposta da API:', response.data);
      if (response?.data?.token) {
        const role = response?.data?.user?.role || 'student';
        console.log('👤 Dados do usuário recebidos:', response.data.user);
        console.log('🎭 Role detectado:', role);
        login(response.data.token, response.data.user);
        Alert.alert('Sucesso', 'Login realizado com sucesso');
        
        // Limpar campos após login bem-sucedido
        setEmail('');
        setPassword('');
        setName('');
        setRegistryId('');
        setConfirmPassword('');
        setCourse('');
        
        // A navegação agora é automática baseada no estado de autenticação
        // Não é mais necessário navegar manualmente
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        Alert.alert('Erro', 'Credenciais inválidas');
      } else if (status === 400) {
        Alert.alert('Erro', 'Preencha todos os campos');
      } else {
        Alert.alert('Erro', 'Erro ao realizar login');
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, apiUrl, login]);

  const handleRegister = useCallback(async () => {
    try {
      if (!name || !email || !registryId || !password || !confirmPassword || !course) {
        Alert.alert('Atenção', 'Preencha todos os campos, incluindo o curso');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }

      setLoading(true);
      console.log('API_URL =>', apiUrl);
      const response = await axios.post(`${apiUrl}/auth/register`, {
        name,
        email,
        registryId,
        password,
        course,
      });
      
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            setActiveTab('login');
            // Limpar campos após cadastro bem-sucedido
            setEmail('');
            setPassword('');
            setName('');
            setRegistryId('');
            setConfirmPassword('');
            setCourse('');
          }
        }
      ]);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        Alert.alert('Erro', 'Dados inválidos');
      } else if (status === 409) {
        Alert.alert('Erro', 'Email já cadastrado');
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar usuário');
      }
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  }, [name, email, registryId, password, confirmPassword, course, apiUrl]);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={themed.background}
      />
      <TouchableOpacity
        style={[styles.themeButton, { backgroundColor: isDarkMode ? themed.text + '20' : 'rgba(0,0,0,0.05)' }]}
        onPress={() => {
          console.log('Toggle pressed, current mode:', isDarkMode);
          toggle();
        }}
      >
        <Text style={styles.themeIcon}>
          {isDarkMode ? '☀' : '🌙'}
        </Text>
      </TouchableOpacity>
      
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
              <OptimizedImage 
                source={require('../../assets/TRILHAS.png')} 
                style={styles.logo} 
                resizeMode="contain"
                placeholder={<Text style={styles.logoPlaceholder}>TRILHAS</Text>}
              />
            </View>
            <Text style={[styles.appTitle, { color: themed.text }]}>IFPR</Text>
            <Text style={[styles.appSubtitle, { color: themed.text + '88' }]}>Criando caminhos para o futuro</Text>
          </View>

          {/* Card Section */}
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e293b' : '#fff', shadowColor: themed.text }]}>
            {/* Navigation Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: isDarkMode ? '#334155' : '#f1f3f4' }]}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'login' ? [styles.activeTab, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }] : styles.inactiveTab]} 
                onPress={() => setActiveTab('login')}
              >
                <Text style={activeTab === 'login' ? [styles.activeTabText, { color: themed.text }] : [styles.inactiveTabText, { color: themed.text + '66' }]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'register' ? [styles.activeTab, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }] : styles.inactiveTab]} 
                onPress={() => setActiveTab('register')}
              >
                <Text style={activeTab === 'register' ? [styles.activeTabText, { color: themed.text }] : [styles.inactiveTabText, { color: themed.text + '66' }]}>Cadastrar</Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={[styles.formContent, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
              {activeTab === 'login' && (
                <>
                  <Text style={[styles.formTitle, { color: themed.text }]}>Acesse sua conta</Text>
                  <Text style={[styles.formSubtitle, { color: themed.text + '88' }]}>Digite seu email e senha para continuar</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Email</Text>
                    <TextInput
                      placeholder="seu@gmail.com"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Senha</Text>
                    <PasswordInput
                      placeholder="Digite sua senha"
                      value={password}
                      onChangeText={setPassword}
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  {/* Forgot Password Link */}
                  <TouchableOpacity 
                    style={styles.forgotPasswordLink}
                    onPress={() => navigation.navigate('Contact')}
                  >
                    <Text style={[styles.forgotPasswordText, { color: themed.text + '88' }]}>
                      Esqueceu a senha?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.loginButton, { backgroundColor: '#1e90ff' }]} 
                    onPress={handleLogin} 
                    disabled={loading}
                  >
                    <Text style={styles.loginButtonText}>{loading ? 'Entrando...' : 'Fazer Login'}</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 'register' && (
                <>
                  <Text style={[styles.formTitle, { color: themed.text }]}>Crie sua conta</Text>
                  <Text style={[styles.formSubtitle, { color: themed.text + '88' }]}>Preencha os dados para se cadastrar</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Nome</Text>
                    <TextInput
                      placeholder="Seu nome completo"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Email</Text>
                    <TextInput
                      placeholder="seu@email.com"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Matrícula</Text>
                    <TextInput
                      placeholder="123456"
                      value={registryId}
                      onChangeText={setRegistryId}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Curso</Text>
                    <View style={styles.coursesGrid}>
                      {courses.map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.courseButton,
                            { 
                              borderColor: course === c ? '#1e90ff' : themed.inputBorder,
                              backgroundColor: course === c ? (isDarkMode ? '#1e3a8a' : '#e6f3ff') : (isDarkMode ? '#334155' : '#fff')
                            }
                          ]}
                          onPress={() => setCourse(c)}
                        >
                          <Text style={[
                            styles.courseButtonText,
                            { color: course === c ? '#1e90ff' : themed.text }
                          ]}>
                            {c}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Senha</Text>
                    <PasswordInput
                      placeholder="Digite sua senha"
                      value={password}
                      onChangeText={setPassword}
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: themed.text }]}>Confirmar Senha</Text>
                    <PasswordInput
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholderTextColor={themed.text + '66'}
                      style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.loginButton, { backgroundColor: '#1e90ff' }]} 
                    onPress={handleRegister} 
                    disabled={loading}
                  >
                    <Text style={styles.loginButtonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
                  </TouchableOpacity>
                </>
              )}

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  themeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.1)',
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
    width: 130,
    height: 130,
  },
  appTitle: {
    fontSize: 32,
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: -1,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  inactiveTabText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContent: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 0,
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
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  logoPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
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
    borderRadius: 12,
    paddingVertical: 14,
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


