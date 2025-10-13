import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

export default function MySubmissionDetailScreen({ navigation, route }) {
  const { submission } = route.params;
  const { colors, isDarkMode } = useTheme();

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
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

  const getStatusDescription = (submission) => {
    switch (submission.status) {
      case 'pending':
        return 'Seu conteúdo está aguardando revisão do professor. Você será notificado quando houver uma atualização.';
      case 'approved':
        return 'Parabéns! Seu conteúdo foi aprovado pelo professor. Continue assim!';
      case 'rejected':
        return 'Seu conteúdo foi rejeitado. Verifique o feedback do professor para melhorias.';
      default:
        return '';
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
        <View style={styles.backButtonContainer}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>📄</Text>
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>
            Minha Submissão
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
        {/* Status Section */}
        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{getStatusIcon(submission.status)}</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Status da Submissão
            </Text>
          </View>
          
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor(submission.status) + '10' }]}>
            <Text style={[styles.statusDescription, { color: getStatusColor(submission.status) }]}>
              {getStatusDescription(submission)}
            </Text>
          </View>
        </View>

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
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Data de Submissão</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {formatDate(submission.created_at)}
              </Text>
            </View>
          </View>

          {submission.reviewed_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👨‍🏫</Text>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textColor + '88' }]}>Data de Revisão</Text>
                <Text style={[styles.infoValue, { color: theme.textColor }]}>
                  {formatDate(submission.reviewed_at)}
                </Text>
              </View>
            </View>
          )}
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

        {/* Feedback do Professor */}
        {submission.feedback && (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💬</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Feedback do Professor
              </Text>
            </View>
            <View style={[styles.feedbackContainer, { backgroundColor: theme.backgroundColor }]}>
              <Text style={[styles.feedback, { color: theme.textColor }]}>
                {submission.feedback}
              </Text>
            </View>
          </View>
        )}
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
  backButtonContainer: {
    flex: 1,
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
  statusContainer: {
    padding: 16,
    borderRadius: 8,
  },
  statusDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
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
  feedbackContainer: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1e90ff',
  },
  feedback: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
