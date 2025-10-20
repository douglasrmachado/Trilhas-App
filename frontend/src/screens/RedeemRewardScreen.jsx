import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTrails } from '../context/TrailContext';
import Constants from 'expo-constants';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function RedeemRewardScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { token, user } = useAuth();
  const { userStats } = useTrails();

  const themed = {
    background: colors.background,
    text: colors.text,
    card: isDarkMode ? '#1e293b' : '#fff',
    primary: '#1e90ff',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
  };

  const [selectedReward, setSelectedReward] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  const rewardTypes = [
    {
      value: 'horas_afins',
      label: 'Horas Afins',
      description: 'Horas complementares para atividades extracurriculares',
      icon: '⏰',
      pointsCost: 100
    },
    {
      value: 'recuperacao_extra',
      label: 'Recuperação Extra',
      description: 'Oportunidade adicional de recuperação em disciplinas',
      icon: '📚',
      pointsCost: 100
    },
    {
      value: 'pontos_extra',
      label: 'Pontos Extra',
      description: 'Pontos adicionais em atividades ou provas',
      icon: '⭐',
      pointsCost: 100
    }
  ];

  const handleRedeem = useCallback(async () => {
    if (!selectedReward) {
      Alert.alert('Erro', 'Selecione um tipo de recompensa');
      return;
    }

    if (userStats.total_xp < selectedReward.pointsCost) {
      Alert.alert(
        'Pontos Insuficientes',
        `Você precisa de ${selectedReward.pointsCost} pontos para resgatar esta recompensa.\n\nSeus pontos atuais: ${userStats.total_xp}`
      );
      return;
    }

    Alert.alert(
      'Confirmar Resgate',
      `Deseja resgatar "${selectedReward.label}" por ${selectedReward.pointsCost} pontos?\n\n${message ? `Mensagem: ${message}` : ''}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: submitRequest }
      ]
    );
  }, [selectedReward, message, userStats]);

  const submitRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(
        `${apiUrl}/reward-requests`,
        {
          rewardType: selectedReward.value,
          message: message.trim() || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Alert.alert(
          'Solicitação Enviada!',
          'Sua solicitação de recompensa foi enviada para análise. Você receberá uma notificação quando for processada.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível enviar a solicitação'
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedReward, message, token, apiUrl, navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top','left','right','bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={themed.background} />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: themed.text }]}>Resgatar</Text>
          <Text style={[styles.headerTitle, { color: themed.text }]}>Recompensa</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pontos Atuais */}
        <View style={[styles.pointsCard, { backgroundColor: themed.card, shadowColor: themed.text }]}>
          <Text style={styles.pointsIcon}>💎</Text>
          <View style={styles.pointsInfo}>
            <Text style={[styles.pointsLabel, { color: themed.text }]}>Seus Pontos</Text>
            <Text style={[styles.pointsValue, { color: themed.primary }]}>{userStats.total_xp}</Text>
          </View>
        </View>

        {/* Tipos de Recompensas */}
        <Text style={[styles.sectionTitle, { color: themed.text }]}>Escolha uma Recompensa</Text>
        
        {rewardTypes.map((reward) => (
          <TouchableOpacity
            key={reward.value}
            style={[
              styles.rewardCard,
              { backgroundColor: themed.card, shadowColor: themed.text },
              selectedReward?.value === reward.value && styles.selectedCard,
              userStats.total_xp < reward.pointsCost && styles.disabledCard
            ]}
            onPress={() => setSelectedReward(reward)}
            disabled={userStats.total_xp < reward.pointsCost}
          >
            <Text style={styles.rewardIcon}>{reward.icon}</Text>
            <View style={styles.rewardInfo}>
              <Text style={[styles.rewardTitle, { color: themed.text }]}>{reward.label}</Text>
              <Text style={[styles.rewardDescription, { color: themed.text + '88' }]}>
                {reward.description}
              </Text>
              <View style={styles.rewardFooter}>
                <Text style={[styles.rewardPoints, { color: themed.warning }]}>
                  {reward.pointsCost} pontos
                </Text>
                {userStats.total_xp < reward.pointsCost && (
                  <Text style={[styles.insufficientPoints, { color: themed.danger }]}>
                    Pontos insuficientes
                  </Text>
                )}
              </View>
            </View>
            {selectedReward?.value === reward.value && (
              <View style={[styles.checkmark, { backgroundColor: themed.success }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Mensagem Opcional */}
        <View style={[styles.messageCard, { backgroundColor: themed.card, shadowColor: themed.text }]}>
          <Text style={[styles.messageLabel, { color: themed.text }]}>
            Mensagem (opcional)
          </Text>
          <TextInput
            style={[styles.messageInput, { color: themed.text, borderColor: themed.text + '33' }]}
            placeholder="Explique por que você precisa desta recompensa..."
            placeholderTextColor={themed.text + '66'}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
          <Text style={[styles.messageCounter, { color: themed.text + '66' }]}>
            {message.length}/500
          </Text>
        </View>

        {/* Botão de Resgate */}
        <TouchableOpacity
          style={[
            styles.redeemButton,
            { backgroundColor: selectedReward ? themed.primary : themed.text + '33' }
          ]}
          onPress={handleRedeem}
          disabled={!selectedReward || isLoading}
        >
          <Text style={styles.redeemIcon}>🎁</Text>
          <Text style={styles.redeemText}>
            {isLoading ? 'Enviando...' : 'Resgatar Recompensa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    position: 'relative',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', lineHeight: 22 },
  headerSpacer: { width: 80 },
  content: { flex: 1, paddingHorizontal: 20 },
  
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  pointsIcon: { fontSize: 32, marginRight: 16 },
  pointsInfo: { flex: 1 },
  pointsLabel: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  pointsValue: { fontSize: 28, fontWeight: 'bold' },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
  disabledCard: {
    opacity: 0.5,
  },
  rewardIcon: { fontSize: 24, marginRight: 16 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  rewardDescription: { fontSize: 14, marginBottom: 8 },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardPoints: { fontSize: 14, fontWeight: '600' },
  insufficientPoints: { fontSize: 12, fontWeight: '600' },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  
  messageCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  messageInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  messageCounter: { fontSize: 12, textAlign: 'right', marginTop: 4 },
  
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 30,
    gap: 8,
  },
  redeemIcon: { fontSize: 20 },
  redeemText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
