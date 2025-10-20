import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Constants from 'expo-constants';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function RewardRequestsScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();

  const themed = {
    background: colors.background,
    text: colors.text,
    card: isDarkMode ? '#1e293b' : '#fff',
    primary: '#1e90ff',
    success: '#4CAF50',
    danger: '#F44336',
    warning: '#FF9800',
  };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/reward-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRequests(response.data.requests || []);
      }
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as solicitações');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = useCallback((request) => {
    setSelectedRequest(request);
    setResponseText('');
    setShowResponseModal(true);
  }, []);

  const handleReject = useCallback((request) => {
    setSelectedRequest(request);
    setResponseText('');
    setShowResponseModal(true);
  }, []);

  const confirmAction = useCallback(async (action) => {
    if (!selectedRequest) return;

    try {
      setProcessingId(selectedRequest.id);
      
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      const response = await axios.patch(
        `${apiUrl}/reward-requests/${selectedRequest.id}/${endpoint}`,
        { response: responseText.trim() || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert(
          'Sucesso',
          `Solicitação ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso!`
        );
        await fetchRequests();
      }
    } catch (error) {
      console.error(`Erro ao ${action}:`, error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || `Não foi possível ${action === 'approve' ? 'aprovar' : 'rejeitar'} a solicitação`
      );
    } finally {
      setProcessingId(null);
      setShowResponseModal(false);
      setSelectedRequest(null);
      setResponseText('');
    }
  }, [selectedRequest, responseText, apiUrl, token, fetchRequests]);

  const getRewardTypeLabel = (type) => {
    const labels = {
      'horas_afins': 'Horas Afins',
      'recuperacao_extra': 'Recuperação Extra',
      'pontos_extra': 'Pontos Extra'
    };
    return labels[type] || type;
  };

  const getRewardIcon = (type) => {
    const icons = {
      'horas_afins': '⏰',
      'recuperacao_extra': '📚',
      'pontos_extra': '⭐'
    };
    return icons[type] || '🎁';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top','left','right','bottom']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={[styles.headerTitle, { color: themed.text }]}>Solicitações de Recompensas</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: themed.text }]}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top','left','right','bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={themed.background} />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: themed.text }]}>Solicitações de Recompensas</Text>
          {requests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{requests.length}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyTitle, { color: themed.text }]}>Nenhuma solicitação pendente</Text>
            <Text style={[styles.emptySubtitle, { color: themed.text + '88' }]}>
              As solicitações de recompensas dos estudantes aparecerão aqui
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: themed.text }]}>
              Gerencie as solicitações de recompensas dos estudantes
            </Text>
            
            {requests.map((request) => (
              <View key={request.id} style={[styles.requestCard, { backgroundColor: themed.card, shadowColor: themed.text }]}>
                {/* Header do Card */}
                <View style={styles.requestHeader}>
                  <View style={styles.studentInfo}>
                    <View style={[styles.avatar, { backgroundColor: themed.primary }]}>
                      <Text style={styles.avatarText}>{getInitials(request.student_name)}</Text>
                    </View>
                    <View style={styles.studentDetails}>
                      <Text style={[styles.studentName, { color: themed.text }]}>{request.student_name}</Text>
                      <Text style={[styles.studentEmail, { color: themed.text + '88' }]}>{request.student_email}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: themed.warning }]}>
                    <Text style={styles.statusText}>Pendente</Text>
                  </View>
                </View>

                {/* Detalhes da Solicitação */}
                <View style={styles.requestDetails}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: themed.text }]}>Recompensa:</Text>
                    <Text style={[styles.detailValue, { color: themed.text }]}>
                      {getRewardIcon(request.reward_type)} {getRewardTypeLabel(request.reward_type)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: themed.text }]}>Pontos:</Text>
                    <Text style={[styles.detailValue, { color: themed.warning }]}>{request.points_cost}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: themed.text }]}>Data:</Text>
                    <Text style={[styles.detailValue, { color: themed.text }]}>{formatDate(request.created_at)}</Text>
                  </View>
                  
                  {request.message && (
                    <View style={styles.messageSection}>
                      <Text style={[styles.messageLabel, { color: themed.text }]}>Mensagem:</Text>
                      <Text style={[styles.messageText, { color: themed.text + '88' }]}>{request.message}</Text>
                    </View>
                  )}
                </View>

                {/* Botões de Ação */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.approveButton, { backgroundColor: themed.success }]}
                    onPress={() => handleApprove(request)}
                    disabled={processingId === request.id}
                  >
                    <Text style={styles.buttonIcon}>✓</Text>
                    <Text style={styles.buttonText}>Aprovar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.rejectButton, { backgroundColor: themed.danger }]}
                    onPress={() => handleReject(request)}
                    disabled={processingId === request.id}
                  >
                    <Text style={styles.buttonIcon}>✗</Text>
                    <Text style={styles.buttonText}>Rejeitar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Modal de Resposta */}
      {showResponseModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themed.card }]}>
            <Text style={[styles.modalTitle, { color: themed.text }]}>
              {selectedRequest?.id ? 'Responder Solicitação' : ''}
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: themed.text + '88' }]}>
              Adicione uma mensagem opcional para o estudante:
            </Text>
            
            <TextInput
              style={[styles.responseInput, { color: themed.text, borderColor: themed.text + '33' }]}
              placeholder="Digite sua resposta..."
              placeholderTextColor={themed.text + '66'}
              value={responseText}
              onChangeText={setResponseText}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            
            <Text style={[styles.responseCounter, { color: themed.text + '66' }]}>
              {responseText.length}/500
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: themed.text + '33' }]}
                onPress={() => setShowResponseModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: themed.text }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: themed.primary }]}
                onPress={() => confirmAction('approve')}
                disabled={processingId !== null}
              >
                <Text style={styles.modalButtonText}>Aprovar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectModalButton, { backgroundColor: themed.danger }]}
                onPress={() => confirmAction('reject')}
                disabled={processingId !== null}
              >
                <Text style={styles.modalButtonText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSpacer: { width: 80 },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  content: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { fontSize: 16 },
  
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  requestCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetails: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  studentEmail: { fontSize: 12 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  requestDetails: { marginBottom: 16 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: { fontSize: 14, fontWeight: '600' },
  detailValue: { fontSize: 14 },
  messageSection: { marginTop: 8 },
  messageLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  messageText: { fontSize: 14, lineHeight: 20 },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  buttonIcon: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, marginBottom: 16 },
  responseInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 8,
  },
  responseCounter: { fontSize: 12, textAlign: 'right', marginBottom: 16 },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {},
  rejectModalButton: {},
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
