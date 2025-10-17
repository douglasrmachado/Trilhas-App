import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';
import PasswordInput from '../components/PasswordInput';

export default function CreateProfessorScreen({ navigation }) {
  const { token } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registryId, setRegistryId] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  
  const courses = ['Informática', 'Meio Ambiente', 'Produção Cultural', 'Mecânica'];

  async function handleCreate() {
    // Validações
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome do professor');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o email');
      return;
    }
    if (!registryId.trim()) {
      Alert.alert('Erro', 'Por favor, preencha a matrícula');
      return;
    }
    if (!course) {
      Alert.alert('Erro', 'Por favor, selecione o curso');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha a senha');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/auth/professors`, {
        name,
        email,
        registryId,
        course,
        password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Professor criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao criar professor';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  const theme = {
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    inputBg: isDarkMode ? '#2d3748' : '#f7f7f7',
    inputBorder: isDarkMode ? '#4a5568' : '#e0e0e0',
    primaryBlue: '#1e90ff',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBg }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Criar Novo Professor</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon Section */}
          <View style={styles.iconSection}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primaryBlue + '20' }]}>
              <Text style={styles.icon}>👨‍🏫</Text>
            </View>
            <Text style={[styles.subtitle, { color: theme.textColor + 'AA' }]}>
              Preencha os dados abaixo para cadastrar um novo professor no sistema
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Nome Completo</Text>
              <TextInput 
                placeholder="Digite o nome completo" 
                placeholderTextColor={theme.textColor + '66'}
                value={name} 
                onChangeText={setName} 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.inputBorder,
                    color: theme.textColor 
                  }
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Email</Text>
              <TextInput 
                placeholder="professor@exemplo.com" 
                placeholderTextColor={theme.textColor + '66'}
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address" 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.inputBorder,
                    color: theme.textColor 
                  }
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Matrícula</Text>
              <TextInput 
                placeholder="Digite a matrícula" 
                placeholderTextColor={theme.textColor + '66'}
                value={registryId} 
                onChangeText={setRegistryId} 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.inputBorder,
                    color: theme.textColor 
                  }
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Curso</Text>
              <TouchableOpacity 
                style={[
                  styles.input, 
                  styles.courseSelector,
                  { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.inputBorder,
                  }
                ]}
                onPress={() => setShowCoursePicker(!showCoursePicker)}
              >
                <Text style={[
                  styles.courseSelectorText, 
                  { color: course ? theme.textColor : theme.textColor + '66' }
                ]}>
                  {course || 'Selecione o curso'}
                </Text>
                <Text style={styles.courseSelectorArrow}>▼</Text>
              </TouchableOpacity>
              
              {showCoursePicker && (
                <View style={[styles.coursePicker, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder }]}>
                  {courses.map((courseOption) => (
                    <TouchableOpacity
                      key={courseOption}
                      style={[
                        styles.courseOption,
                        course === courseOption && { backgroundColor: theme.primaryBlue + '20' }
                      ]}
                      onPress={() => {
                        setCourse(courseOption);
                        setShowCoursePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.courseOptionText,
                        { color: theme.textColor },
                        course === courseOption && { color: theme.primaryBlue, fontWeight: 'bold' }
                      ]}>
                        {courseOption}
                      </Text>
                      {course === courseOption && (
                        <Text style={styles.courseOptionCheck}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Senha</Text>
              <PasswordInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.inputBorder,
                    color: theme.textColor 
                  }
                ]}
                placeholderTextColor={theme.textColor + '66'}
              />
              <Text style={[styles.hint, { color: theme.textColor + '88' }]}>
                A senha deve ter pelo menos 6 caracteres
              </Text>
            </View>
          </View>

          {/* Button Section */}
          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: theme.primaryBlue },
              loading && styles.buttonDisabled
            ]} 
            onPress={handleCreate} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Criando...' : '✓ Criar Professor'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseSelectorText: {
    fontSize: 16,
    flex: 1,
  },
  courseSelectorArrow: {
    fontSize: 12,
    color: '#666',
  },
  coursePicker: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  courseOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  courseOptionText: {
    fontSize: 16,
    flex: 1,
  },
  courseOptionCheck: {
    fontSize: 18,
    color: '#1e90ff',
    fontWeight: 'bold',
  },
});


