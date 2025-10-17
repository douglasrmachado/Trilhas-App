import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function ModuleContentScreen({ route, navigation }) {
  const { module, trailTitle } = route.params;
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
    successGreen: '#4CAF50',
  }), [colors, isDarkMode]);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      console.log('📚 Buscando conteúdos do módulo:', module.id);
      const response = await axios.get(
        `${apiUrl}/trails/modules/${module.id}/contents`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('📚 Resposta da API:', response.data);
      
      if (response.data.success) {
        const loadedContents = response.data.contents || [];
        console.log('📚 Conteúdos carregados:', loadedContents);
        setContents(loadedContents);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar conteúdos:', error);
      console.error('❌ Detalhes:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível carregar os conteúdos');
    } finally {
      setLoading(false);
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.textColor + '20' }]}>
        <View style={styles.headerLeft}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            📚 Conteúdos
          </Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Module Info Card */}
        <View style={[styles.moduleCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleIcon}>
              {module.index === 0 ? '🥉' : module.index === 1 ? '🥈' : module.index === 2 ? '🥇' : '🏆'}
            </Text>
            <View style={styles.moduleInfo}>
              <Text style={[styles.trailTitle, { color: theme.textColor + '88' }]}>
                {trailTitle}
              </Text>
              <Text style={[styles.moduleTitle, { color: theme.textColor }]}>
                {module.title}
              </Text>
              <Text style={[styles.moduleDescription, { color: theme.textColor + '88' }]}>
                {module.description}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={[styles.statText, { color: theme.textColor }]}>
                {module.xp} XP
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={[styles.statText, { color: theme.textColor }]}>
                {contents.length} {contents.length === 1 ? 'item' : 'itens'}
              </Text>
            </View>
          </View>
        </View>

        {/* Contents List */}
        <View style={styles.contentsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            📖 Materiais de Estudo
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primaryBlue} />
              <Text style={[styles.loadingText, { color: theme.textColor }]}>
                Carregando conteúdos...
              </Text>
            </View>
          ) : contents.length > 0 ? (
            <View style={styles.contentsList}>
              {contents.map((content, index) => (
                <View 
                  key={content.id}
                  style={[styles.contentCard, { backgroundColor: theme.cardBackground }]}
                >
                  <View style={styles.contentHeader}>
                    <Text style={styles.contentTypeIcon}>
                      {getContentTypeIcon(content.content_type)}
                    </Text>
                    <View style={styles.contentInfo}>
                      <Text style={[styles.contentTitle, { color: theme.textColor }]}>
                        {content.title}
                      </Text>
                      <Text style={[styles.contentAuthor, { color: theme.textColor + '88' }]}>
                        por {content.author_name}
                      </Text>
                      {content.description && (
                        <Text style={[styles.contentDescription, { color: theme.textColor + '66' }]}>
                          {content.description}
                        </Text>
                      )}
                    </View>
                  </View>

                  {content.file_name && (
                    <TouchableOpacity
                      style={[styles.viewButton, { backgroundColor: theme.primaryBlue }]}
                      onPress={() => {
                        navigation.navigate('PDFPreview', {
                          fileUrl: `${apiUrl}/submissions/${content.id}/preview?token=${token}`,
                          fileName: content.file_name,
                          title: content.title,
                          submissionId: content.id
                        });
                      }}
                    >
                      <Text style={styles.viewIcon}>📄</Text>
                      <Text style={styles.viewText}>
                        Visualizar Material
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.cardBackground }]}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
                Nenhum conteúdo disponível
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.textColor + '88' }]}>
                Os materiais de estudo aparecerão aqui quando forem aprovados pelo professor
              </Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={[styles.tipsCard, { backgroundColor: theme.primaryBlue + '15' }]}>
          <Text style={styles.tipsIcon}>💡</Text>
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, { color: theme.textColor }]}>
              Dica de Estudo
            </Text>
            <Text style={[styles.tipsText, { color: theme.textColor + '88' }]}>
              Baixe os materiais e estude com atenção. Após concluir, você pode marcar o módulo como completo e ganhar XP!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  moduleCard: {
    margin: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  moduleIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  trailTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  contentsList: {
    gap: 12,
  },
  contentCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contentTypeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentAuthor: {
    fontSize: 13,
    marginBottom: 6,
  },
  contentDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  viewIcon: {
    fontSize: 16,
  },
  viewText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

