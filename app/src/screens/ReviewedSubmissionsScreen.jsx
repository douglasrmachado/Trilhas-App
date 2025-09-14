import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

export default function ReviewedSubmissionsScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    borderColor: colors.text + '33',
    primaryBlue: '#1e90ff',
    successGreen: '#10b981',
    warningOrange: '#f59e0b',
    dangerRed: '#ef4444',
    headerBg: isDarkMode ? '#1e293b' : '#fff',
    headerText: colors.text,
  }), [colors, isDarkMode]);

  useEffect(() => {
    loadReviewedSubmissions();
  }, []);

  const loadReviewedSubmissions = async () => {
    try {
      const apiUrl = getApiUrl();
      console.log('📋 Carregando submissões revisadas...');

      const response = await fetch(`${apiUrl}/submissions/reviewed`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Submissões revisadas carregadas:', result.data.length);
        setSubmissions(result.data);
      } else {
        throw new Error(result.message || 'Erro ao carregar submissões revisadas');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar submissões revisadas:', error);
      Alert.alert('Erro', 'Erro ao carregar submissões revisadas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReviewedSubmissions();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return theme.successGreen;
      case 'rejected': return theme.dangerRed;
      default: return theme.textColor;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
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

  const SubmissionCard = ({ submission }) => (
    <TouchableOpacity
      style={[styles.submissionCard, { backgroundColor: theme.cardBg }]}
      onPress={() => navigation.navigate('SubmissionDetail', { submission })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.contentIcon}>
            {getContentTypeIcon(submission.content_type)}
          </Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.submissionTitle, { color: theme.textColor }]} numberOfLines={2}>
              {submission.title}
            </Text>
            <Text style={[styles.submissionMeta, { color: theme.textColor + '88' }]}>
              {submission.subject} • {submission.year}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusIcon}>{getStatusIcon(submission.status)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(submission.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(submission.status) }]}>
              {getStatusText(submission.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.description, { color: theme.textColor + 'CC' }]} numberOfLines={2}>
          {submission.description}
        </Text>
        
        {submission.feedback && (
          <View style={[styles.feedbackPreview, { backgroundColor: theme.backgroundColor }]}>
            <Text style={styles.feedbackIcon}>💬</Text>
            <Text style={[styles.feedbackText, { color: theme.textColor + 'CC' }]} numberOfLines={2}>
              {submission.feedback}
            </Text>
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.authorInfo}>
            <Text style={styles.authorIcon}>👤</Text>
            <Text style={[styles.authorName, { color: theme.textColor + '88' }]}>
              {submission.user_name || 'Estudante'}
            </Text>
          </View>
          
          <Text style={[styles.dateText, { color: theme.textColor + '66' }]}>
            Revisado em {formatDate(submission.reviewed_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={theme.backgroundColor}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textColor }]}>
            Carregando submissões revisadas...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerIcon}>📋</Text>
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>
            Submissões Revisadas ({submissions.length})
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
              Nenhuma submissão revisada
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textColor + '88' }]}>
              Você ainda não revisou nenhuma submissão
            </Text>
          </View>
        ) : (
          <View style={styles.submissionsList}>
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
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
  refreshIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  submissionsList: {
    padding: 20,
  },
  submissionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  contentIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  submissionMeta: {
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIcon: {
    fontSize: 20,
    marginBottom: 4,
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
  cardContent: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  feedbackPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  feedbackIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  feedbackText: {
    fontSize: 14,
    flex: 1,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  authorName: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
  },
});
