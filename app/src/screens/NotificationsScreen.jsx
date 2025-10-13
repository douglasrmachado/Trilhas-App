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
      })));
    } catch (e) {
      // ignore UI errors
    }
  }, [apiUrl, token]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const clearAll = useCallback(() => {
    if (notifications.length === 0) return;
    Alert.alert('Limpar notificações', 'Deseja remover todas as notificações?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: async () => {
        try {
          await axios.post(`${apiUrl}/notifications/clear`, {}, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setNotifications([]);
        } catch (e) {}
      } },
    ]);
  }, [notifications]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top','left','right','bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={themed.background} />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: themed.text }]}>Notificações</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Text style={styles.clearIcon}>🗑️</Text>
          <Text style={[styles.clearText, { color: themed.text }]}>Limpar</Text>
        </TouchableOpacity>
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
            <View key={n.id} style={[styles.card, { backgroundColor: themed.card, shadowColor: themed.text }]}>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  clearButton: { flexDirection: 'row', alignItems: 'center' },
  clearIcon: { fontSize: 14, marginRight: 6 },
  clearText: { fontSize: 14, fontWeight: '600' },
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
  },
  cardIcon: { fontSize: 22, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { fontSize: 14 },
});


