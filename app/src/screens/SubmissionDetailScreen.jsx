import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

export default function SubmissionDetailScreen({ navigation, route }) {
  const { submission } = route.params;
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    borderColor: colors.text + '33',
    primaryBlue: '#1e90ff',
    successGreen: '#10b981',
    dangerRed: '#ef4444',
    warningOrange: '#f59e0b',
    headerBg: isDarkMode ? '#1e293b' : '#fff',
    headerText: colors.text,
  }), [colors, isDarkMode]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return theme.warningOrange;
      case 'approved': return theme.successGreen;
      case 'rejected': return theme.dangerRed;
      default: return theme.textColor;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'resumo': return '📄';
      case 'mapa': return '🗺️';
      case 'exercicio': return '📝';
      case 'apresentacao': return '📊';
      default: return '📄';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = () => {
    Alert.alert(
      'Aprovar Submissão',
      'Tem certeza que deseja aprovar esta submissão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aprovar', onPress: () => submitDecision('approved') }
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Rejeitar Submissão',
      'Deseja adicionar um feedback explicando o motivo da rejeição?',
      [
        { text: 'Sem Feedback', onPress: () => submitDecision('rejected') },
        { text: 'Com Feedback', onPress: () => setShowFeedbackInput(true) }
      ]
    );
  };

  const submitDecision = async (status) => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      console.log('🔄 Submetendo decisão:', { status, feedback });

      const response = await fetch(`${apiUrl}/submissions/${submission.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          feedback: feedback.trim() || undefined
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Decisão submetida com sucesso');
        
        Alert.alert(
          'Sucesso!',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error(result.message || 'Erro ao submeter decisão');
      }
    } catch (error) {
      console.error('❌ Erro ao submeter decisão:', error);
      Alert.alert('Erro', error.message || 'Erro ao submeter decisão');
    } finally {
      setLoading(false);
      setShowFeedbackInput(false);
      setFeedback('');
    }
  };

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
          <Text style={styles.headerIcon}>📄</Text>
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>
            Detalhes da Submissão
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(submission.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(submission.status) }]}>
              {getStatusText(submission.status)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Informações Básicas */}
        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Informações Básicas
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>{getContentTypeIcon(submission.content_type)}</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Título</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>{submission.title}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📚</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Matéria</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>{submission.subject}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🎓</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Ano/Série</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>{submission.year}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Autor</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {submission.user_name || 'Estudante'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Data de Submissão</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {formatDate(submission.created_at)}
              </Text>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Descrição
            </Text>
          </View>
          <Text style={[styles.description, { color: theme.textColor }]}>
            {submission.description}
          </Text>
        </View>

        {/* Palavras-chave */}
        {submission.keywords && (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏷️</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Palavras-chave
              </Text>
            </View>
            <Text style={[styles.keywords, { color: theme.textColor }]}>
              {submission.keywords}
            </Text>
          </View>
        )}

        {/* Arquivo */}
        {submission.file_name && (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📎</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Arquivo Anexado
              </Text>
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileIcon}>📄</Text>
              <View style={styles.fileDetails}>
                <Text style={[styles.fileName, { color: theme.textColor }]}>
                  {submission.file_name}
                </Text>
                <Text style={[styles.fileSize, { color: theme.textColor + '88' }]}>
                  {submission.file_size ? `${(submission.file_size / 1024 / 1024).toFixed(2)} MB` : 'Tamanho não disponível'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Feedback */}
        {submission.feedback && (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💬</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Feedback
              </Text>
            </View>
            <Text style={[styles.feedback, { color: theme.textColor }]}>
              {submission.feedback}
            </Text>
          </View>
        )}

        {/* Input de Feedback */}
        {showFeedbackInput && (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✏️</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Adicionar Feedback
              </Text>
            </View>
            <TextInput
              style={[styles.feedbackInput, { 
                borderColor: theme.borderColor,
                backgroundColor: theme.backgroundColor,
                color: theme.textColor 
              }]}
              placeholder="Explique o motivo da rejeição..."
              placeholderTextColor={theme.textColor + '66'}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.feedbackActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.borderColor }]}
                onPress={() => {
                  setShowFeedbackInput(false);
                  setFeedback('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textColor }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rejectButton, { backgroundColor: theme.dangerRed }]}
                onPress={() => submitDecision('rejected')}
                disabled={loading}
              >
                <Text style={styles.rejectButtonText}>
                  {loading ? 'Rejeitando...' : 'Rejeitar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Ações */}
      {submission.status === 'pending' && !showFeedbackInput && (
        <View style={[styles.actions, { backgroundColor: theme.cardBg }]}>
          <TouchableOpacity
            style={[styles.rejectButton, { backgroundColor: theme.dangerRed }]}
            onPress={handleReject}
            disabled={loading}
          >
            <Text style={styles.rejectButtonText}>
              {loading ? 'Processando...' : 'Rejeitar'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.approveButton, { backgroundColor: theme.successGreen }]}
            onPress={handleApprove}
            disabled={loading}
          >
            <Text style={styles.approveButtonText}>
              {loading ? 'Processando...' : 'Aprovar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  keywords: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
  },
  feedback: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  feedbackActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  approveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
