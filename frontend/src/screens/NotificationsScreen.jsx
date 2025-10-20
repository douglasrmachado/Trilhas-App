import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Constants from 'expo-constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function NotificationsScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();

  const themed = {
    background: colors.background,
    text: colors.text,
    card: isDarkMode ? '#1e293b' : '#fff',
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const items = response?.data?.items || [];
      setNotifications(items.map((n) => ({
        id: String(n.id),
        icon: n.type === 'submission_approved' ? '✅' : n.type === 'submission_rejected' ? '❌' : '📝',
        title: n.title,
        subtitle: n.body || '',
        isRead: n.is_read === 1,
      })));
      
      // Buscar contagem de não lidas
      const countRes = await axios.get(`${apiUrl}/notifications/count`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUnreadCount(countRes?.data?.count || 0);
    } catch (e) {
      // ignore UI errors
    }
  }, [apiUrl, token]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;
    try {
      await axios.post(`${apiUrl}/notifications/mark-all-read`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await fetchNotifications();
      Alert.alert('Sucesso', 'Todas as notificações foram marcadas como lidas');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível marcar as notificações como lidas');
    }
  }, [apiUrl, token, unreadCount, fetchNotifications]);

  const deleteAll = useCallback(() => {
    if (notifications.length === 0) return;
    Alert.alert('Excluir notificações', 'Deseja excluir todas as notificações permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          await axios.delete(`${apiUrl}/notifications/delete-all`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setNotifications([]);
          setUnreadCount(0);
          Alert.alert('Sucesso', 'Todas as notificações foram excluídas');
        } catch (e) {
          Alert.alert('Erro', 'Não foi possível excluir as notificações');
        }
      } },
    ]);
  }, [apiUrl, token, notifications]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top','left','right','bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={themed.background} />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: themed.text }]}>Notificações</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Text style={styles.actionIcon}>✓</Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.deleteButton} onPress={deleteAll} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon]}>📭</Text>
          <Text style={[styles.emptyTitle, { color: themed.text }]}>Sem notificações</Text>
          <Text style={[styles.emptySubtitle, { color: themed.text + '88' }]}>Novas notificações aparecerão aqui</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {notifications.map(n => (
            <View 
              key={n.id} 
              style={[
                styles.card, 
                { backgroundColor: themed.card, shadowColor: themed.text },
                !n.isRead && styles.unreadCard
              ]}
            >
              {!n.isRead && (
                <View style={styles.unreadIndicator} />
              )}
              <Text style={styles.cardIcon}>{n.icon}</Text>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: themed.text }]}>{n.title}</Text>
                <Text style={[styles.cardSubtitle, { color: themed.text + '88' }]}>{n.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionIcon: {
    fontSize: 24,
    color: '#4CAF50',
  },
  deleteButton: { 
    padding: 4,
  },
  deleteIcon: { 
    fontSize: 18,
  },
  content: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1e90ff',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  cardIcon: { fontSize: 22, marginRight: 12 },
  cardInfo: { flex: 1, paddingRight: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { fontSize: 14 },
});


