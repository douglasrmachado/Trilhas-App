import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getApiUrl, testApiConnection } from '../config/api';
import * as DocumentPicker from 'expo-document-picker';

export default function SubmitContentScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    year: '',
    contentType: 'Resumo',
    description: '',
    keywords: '',
  });
  
  // Estados para dropdowns
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  
  // Estado do arquivo
  const [selectedFile, setSelectedFile] = useState(null);

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    borderColor: colors.text + '33',
    primaryBlue: '#1e90ff',
    headerBg: isDarkMode ? '#1e293b' : '#fff',
    headerText: colors.text,
  }), [colors, isDarkMode]);

  // Opções para os dropdowns
  const subjects = [
    'Matemática', 'Física', 'Química', 'Biologia', 'História', 
    'Geografia', 'Português', 'Inglês', 'Filosofia', 'Sociologia'
  ];

  const years = [
    '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano',
    '6º Ano', '7º Ano', '8º Ano', '9º Ano', 'Ensino Médio'
  ];

  const contentTypes = [
    { id: 'resumo', name: 'Resumo', icon: '📄' },
    { id: 'mapa', name: 'Mapa Conceitual', icon: '🗺️' },
    { id: 'exercicio', name: 'Exercícios', icon: '📝' },
    { id: 'apresentacao', name: 'Apresentação', icon: '📊' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Verificar tamanho do arquivo (10MB = 10 * 1024 * 1024 bytes)
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('Erro', 'O arquivo deve ter no máximo 10MB');
          return;
        }

        setSelectedFile(file);
        Alert.alert('Sucesso', 'Arquivo selecionado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error);
      Alert.alert('Erro', 'Erro ao selecionar arquivo');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return false;
    }
    if (!formData.subject) {
      Alert.alert('Erro', 'Matéria é obrigatória');
      return false;
    }
    if (!formData.year) {
      Alert.alert('Erro', 'Ano/Série é obrigatório');
      return false;
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      Alert.alert('Erro', 'Descrição deve ter pelo menos 5 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      console.log('🌐 Usando API URL:', apiUrl);
      
      // Testar conexão primeiro
      const isConnected = await testApiConnection();
      if (!isConnected) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o servidor está rodando.');
      }
      
      console.log('📝 Enviando submissão:', formData);
      
      // Preparar dados para envio
      const submissionData = {
        title: formData.title,
        subject: formData.subject,
        year: formData.year,
        contentType: formData.contentType,
        description: formData.description,
        keywords: formData.keywords || undefined,
      };

      // Enviar para o backend
      const response = await fetch(`${apiUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Submissão salva no banco:', result.data);
        
        Alert.alert(
          'Sucesso!', 
          'Seu conteúdo foi submetido com sucesso e será analisado pelos professores.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error(result.message || 'Erro ao submeter conteúdo');
      }
    } catch (error) {
      console.error('❌ Erro ao submeter:', error);
      Alert.alert('Erro', error.message || 'Erro ao submeter conteúdo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const Dropdown = ({ options, selectedValue, onSelect, placeholder, isOpen, onToggle }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, { 
          borderColor: theme.borderColor,
          backgroundColor: theme.cardBg 
        }]}
        onPress={onToggle}
      >
        <Text style={[styles.dropdownText, { color: theme.textColor }]}>
          {selectedValue || placeholder}
        </Text>
        <Text style={[styles.dropdownArrow, { color: theme.textColor }]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdownList, { 
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor 
        }]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                onToggle();
              }}
            >
              <Text style={[styles.dropdownItemText, { color: theme.textColor }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const ContentTypeDropdown = ({ options, selectedValue, onSelect, placeholder, isOpen, onToggle }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, { 
          borderColor: theme.borderColor,
          backgroundColor: theme.cardBg 
        }]}
        onPress={onToggle}
      >
        <View style={styles.contentTypeRow}>
          {selectedValue && (
            <Text style={styles.contentTypeIcon}>
              {options.find(opt => opt.name === selectedValue)?.icon || '📄'}
            </Text>
          )}
          <Text style={[styles.dropdownText, { color: theme.textColor }]}>
            {selectedValue || placeholder}
          </Text>
        </View>
        <Text style={[styles.dropdownArrow, { color: theme.textColor }]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdownList, { 
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor 
        }]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option.name);
                onToggle();
              }}
            >
              <View style={styles.contentTypeRow}>
                <Text style={styles.contentTypeIcon}>{option.icon}</Text>
                <Text style={[styles.dropdownItemText, { color: theme.textColor }]}>
                  {option.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: theme.headerText }]}>← Voltar</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>📄✏️</Text>
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>Submeter Conteúdo</Text>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.userIcon}>👤</Text>
          <Text style={[styles.userName, { color: theme.headerText }]}>João Silva</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Card Principal */}
        <View style={[styles.mainCard, { backgroundColor: theme.cardBg }]}>
          
          {/* Seção de Título */}
          <View style={styles.titleSection}>
            <Text style={styles.rocketIcon}>🚀</Text>
            <View style={styles.titleTextContainer}>
              <Text style={[styles.mainTitle, { color: theme.textColor }]}>
                Submeter Novo Conteúdo
              </Text>
              <Text style={[styles.subtitle, { color: theme.textColor + '88' }]}>
                Compartilhe seus conhecimentos com outros estudantes criando resumos ou mapas conceituais
              </Text>
            </View>
          </View>

          {/* Seção Informações Básicas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Informações Básicas
              </Text>
            </View>

            {/* Título */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>
                Título *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: theme.borderColor,
                  backgroundColor: theme.cardBg,
                  color: theme.textColor 
                }]}
                placeholder="Ex: Resumo sobre Equações do 2º Grau"
                placeholderTextColor={theme.textColor + '66'}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
              />
            </View>

            {/* Matéria */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>
                Matéria *
              </Text>
              <Dropdown
                options={subjects}
                selectedValue={formData.subject}
                onSelect={(value) => handleInputChange('subject', value)}
                placeholder="Selecione a matéria"
                isOpen={showSubjectDropdown}
                onToggle={() => {
                  setShowSubjectDropdown(!showSubjectDropdown);
                  setShowYearDropdown(false);
                  setShowContentTypeDropdown(false);
                }}
              />
            </View>

            {/* Ano/Série */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>
                Ano/Série *
              </Text>
              <Dropdown
                options={years}
                selectedValue={formData.year}
                onSelect={(value) => handleInputChange('year', value)}
                placeholder="Selecione o ano"
                isOpen={showYearDropdown}
                onToggle={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowSubjectDropdown(false);
                  setShowContentTypeDropdown(false);
                }}
              />
            </View>

            {/* Tipo de Conteúdo */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>
                Tipo de Conteúdo *
              </Text>
              <ContentTypeDropdown
                options={contentTypes}
                selectedValue={formData.contentType}
                onSelect={(value) => handleInputChange('contentType', value)}
                placeholder="Selecione o tipo"
                isOpen={showContentTypeDropdown}
                onToggle={() => {
                  setShowContentTypeDropdown(!showContentTypeDropdown);
                  setShowSubjectDropdown(false);
                  setShowYearDropdown(false);
                }}
              />
            </View>
          </View>

          {/* Seção Descrição */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Descrição do Conteúdo
              </Text>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>
                Descrição *
              </Text>
              <TextInput
                style={[styles.textArea, { 
                  borderColor: theme.borderColor,
                  backgroundColor: theme.cardBg,
                  color: theme.textColor 
                }]}
                placeholder="Descreva detalhadamente o conteúdo que você está submetendo. Inclua os tópicos abordados e como pode ajudar outros estudantes..."
                placeholderTextColor={theme.textColor + '66'}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Palavras-chave */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>
                Palavras-chave (opcional)
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: theme.borderColor,
                  backgroundColor: theme.cardBg,
                  color: theme.textColor 
                }]}
                placeholder="Ex: equações, matemática, álgebra"
                placeholderTextColor={theme.textColor + '66'}
                value={formData.keywords}
                onChangeText={(value) => handleInputChange('keywords', value)}
              />
            </View>
          </View>

          {/* Seção Anexar Arquivo */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📎</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Anexar Arquivo
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.fileUploadArea, { 
                borderColor: theme.borderColor,
                backgroundColor: theme.cardBg 
              }]}
              onPress={handleFileSelection}
            >
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={[styles.fileUploadText, { color: theme.primaryBlue }]}>
                {selectedFile ? selectedFile.name : 'Clique para selecionar um arquivo PDF'}
              </Text>
              <Text style={[styles.fileUploadSubtext, { color: theme.textColor + '88' }]}>
                Formato: PDF | Tamanho máximo: 10MB
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primaryBlue }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonIcon}>⬆️</Text>
              <Text style={styles.submitButtonText}>
                {loading ? 'Submetendo...' : 'Submeter Conteúdo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { 
                borderColor: theme.borderColor,
                backgroundColor: theme.cardBg 
              }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textColor }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  userIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  rocketIcon: {
    fontSize: 32,
    marginRight: 16,
    marginTop: 4,
  },
  titleTextContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 120,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  contentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  fileUploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  fileUploadText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  fileUploadSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  submitButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
