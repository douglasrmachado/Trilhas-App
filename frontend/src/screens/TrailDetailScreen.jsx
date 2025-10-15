import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useTrails } from '../context/TrailContext';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function TrailDetailScreen({ route, navigation }) {
  const { trail } = route.params;
  const { colors, isDarkMode } = useTheme();
  const { fetchTrailModules, updateModuleProgress } = useTrails();
  const { token } = useAuth();
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleContents, setModuleContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingContents, setLoadingContents] = useState(false);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
    lightBlue: '#e6f3ff',
    darkBlue: '#0066cc',
    successGreen: '#4CAF50',
    warningOrange: '#FF9800',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  }), [colors, isDarkMode]);

  // Carregar módulos da trilha
  useEffect(() => {
    async function loadModules() {
      setLoading(true);
      const data = await fetchTrailModules(trail.id);
      if (data) {
        // Transformar dados da API para o formato esperado
        const formattedModules = data.map((mod, idx) => {
          return {
            id: mod.id,
            title: mod.title,
            description: mod.description,
            resources: mod.resources_count,
            completed: mod.status === 'completed',
            xp: mod.xp_reward,
            is_locked: mod.is_locked,
            status: mod.status
          };
        });
        setModules(formattedModules);
      }
      setLoading(false);
    }
    loadModules();
  }, [trail.id, fetchTrailModules]);

  // Função para buscar conteúdos de um módulo
  const loadModuleContents = async (moduleId) => {
    if (moduleContents[moduleId]) return; // Já carregou
    
    try {
      setLoadingContents(true);
      const response = await axios.get(
        `${apiUrl}/trails/modules/${moduleId}/contents`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setModuleContents(prev => ({
          ...prev,
          [moduleId]: response.data.contents || []
        }));
      }
    } catch (error) {
      console.error('❌ Erro ao buscar conteúdos:', error);
      setModuleContents(prev => ({
        ...prev,
        [moduleId]: []
      }));
    } finally {
      setLoadingContents(false);
    }
  };

  // Carregar conteúdos quando selecionar um módulo
  useEffect(() => {
    if (selectedModule) {
      loadModuleContents(selectedModule);
    }
  }, [selectedModule]);

  const getAchievementIcon = () => {
    if (trail.progress === 100) return '🏆';
    if (trail.progress >= 75) return '🥉';
    if (trail.progress >= 50) return '🥈';
    return '🥇';
  };

  const getProgressColor = () => {
    if (trail.progress === 100) return theme.gold;
    if (trail.progress >= 75) return theme.warningOrange;
    if (trail.progress >= 50) return theme.successGreen;
    return theme.primaryBlue;
  };

  const totalXP = modules.reduce((sum, module) => sum + (module.completed ? module.xp : 0), 0);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primaryBlue} />
          <Text style={[{ color: theme.textColor, marginTop: 16 }]}>Carregando módulos...</Text>
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
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Detalhes da Trilha</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trail Overview */}
        <View style={[styles.trailOverview, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.trailHeader}>
            <Text style={styles.trailIcon}>{trail.icon}</Text>
            <View style={styles.trailInfo}>
              <Text style={[styles.trailTitle, { color: theme.textColor }]}>{trail.title}</Text>
              <Text style={[styles.trailDescription, { color: theme.textColor + '88' }]}>
                {trail.description}
              </Text>
            </View>
            <View style={[styles.achievementBadge, { backgroundColor: getProgressColor() }]}>
              <Text style={styles.achievementIcon}>{getAchievementIcon()}</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: theme.textColor + '88' }]}>Progresso</Text>
              <Text style={[styles.progressText, { color: theme.textColor }]}>
                {trail.completed}/{trail.total} módulos
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme.textColor + '20' }]}>
                <View style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: getProgressColor(),
                    width: `${trail.progress}%` 
                  }
                ]} />
              </View>
              <Text style={[styles.progressPercentage, { color: theme.textColor }]}>
                {trail.progress}%
              </Text>
            </View>
          </View>

          {/* XP Counter */}
          <View style={styles.xpSection}>
            <Text style={styles.xpIcon}>⭐</Text>
            <Text style={[styles.xpText, { color: theme.textColor }]}>
              {totalXP} XP conquistados
            </Text>
          </View>
        </View>

        {/* Gamified Learning Path */}
        <View style={styles.modulesSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>🗺️ Mapa de Aprendizado</Text>
          
          <View style={styles.gamifiedPath}>
            {modules.map((module, index) => {
              const isNextModule = !module.completed && (index === 0 || modules[index - 1]?.completed);
              
              return (
                <View key={module.id} style={styles.pathRow}>
                  {/* Module Card */}
                  <TouchableOpacity
                    style={[
                      styles.gameModuleCard,
                      { 
                        backgroundColor: theme.cardBackground,
                        borderColor: module.completed 
                          ? theme.successGreen 
                          : isNextModule 
                            ? theme.primaryBlue 
                            : theme.textColor + '20'
                      }
                    ]}
                    onPress={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    disabled={!module.completed && !isNextModule}
                    activeOpacity={0.7}
                  >
                      <View style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <View style={styles.levelInfo}>
                            <Text style={[styles.moduleNumber, { color: theme.textColor }]}>
                              Nível {index + 1}
                            </Text>
                            <Text style={[styles.gameModuleTitle, { color: theme.textColor }]}>
                              {module.title}
                            </Text>
                          </View>
                          <View style={styles.medalContainer}>
                            <Text style={styles.cardMedalEmoji}>
                              {index === 0 ? '🥉' : index === 1 ? '🥈' : index === 2 ? '🥇' : '🏆'}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.gameModuleDesc, { color: theme.textColor + '88' }]}>
                          {module.description}
                        </Text>
                        
                        {/* XP and Resources */}
                        <View style={styles.cardStats}>
                          <View style={styles.cardStat}>
                            <Text style={styles.cardStatIcon}>⭐</Text>
                            <Text style={[styles.cardStatText, { color: theme.textColor }]}>
                              {module.xp} XP
                            </Text>
                          </View>
                          <View style={styles.cardStat}>
                            <Text style={styles.cardStatIcon}>📚</Text>
                            <Text style={[styles.cardStatText, { color: theme.textColor }]}>
                              {module.resources} itens
                            </Text>
                          </View>
                        </View>

                        {/* Status Badge */}
                        <View style={[
                          styles.statusBadge,
                          { 
                            backgroundColor: module.completed 
                              ? theme.successGreen + '20' 
                              : isNextModule 
                                ? theme.primaryBlue + '20' 
                                : theme.textColor + '10'
                          }
                        ]}>
                          <Text style={[
                            styles.statusBadgeText,
                            { 
                              color: module.completed 
                                ? theme.successGreen 
                                : isNextModule 
                                  ? theme.primaryBlue 
                                  : theme.textColor + '60'
                            }
                          ]}>
                            {module.completed ? '✓ Concluído' : isNextModule ? '▶ Disponível' : '🔒 Bloqueado'}
                          </Text>
                        </View>
                      </View>

                      {/* Expanded Content */}
                      {selectedModule === module.id && (
                        <View style={styles.expandedActions}>
                          <View style={[styles.divider, { backgroundColor: theme.textColor + '15' }]} />
                          
                          {/* Conteúdos Disponíveis */}
                          <View style={styles.contentsSection}>
                            <Text style={[styles.contentsSectionTitle, { color: theme.textColor }]}>
                              📚 Conteúdos Disponíveis
                            </Text>
                            
                            {loadingContents ? (
                              <ActivityIndicator size="small" color={theme.primaryBlue} style={{ marginVertical: 10 }} />
                            ) : moduleContents[module.id] && moduleContents[module.id].length > 0 ? (
                              <View style={styles.contentsList}>
                                {moduleContents[module.id].map((content, idx) => (
                                  <TouchableOpacity 
                                    key={content.id}
                                    style={[styles.contentItem, { backgroundColor: isDarkMode ? '#334155' : '#f8f9fa' }]}
                                  >
                                    <Text style={styles.contentTypeIcon}>
                                      {content.content_type === 'resumo' ? '📄' : '🗺️'}
                                    </Text>
                                    <View style={styles.contentInfo}>
                                      <Text style={[styles.contentTitle, { color: theme.textColor }]}>
                                        {content.title}
                                      </Text>
                                      <Text style={[styles.contentAuthor, { color: theme.textColor + '88' }]}>
                                        por {content.author_name}
                                      </Text>
                                    </View>
                                    <Text style={[styles.contentArrow, { color: theme.primaryBlue }]}>→</Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            ) : (
                              <View style={[styles.emptyContent, { backgroundColor: isDarkMode ? '#334155' : '#f8f9fa' }]}>
                                <Text style={styles.emptyIcon}>📭</Text>
                                <Text style={[styles.emptyText, { color: theme.textColor + '88' }]}>
                                  Nenhum conteúdo aprovado ainda
                                </Text>
                                <Text style={[styles.emptySubtext, { color: theme.textColor + '66' }]}>
                                  Seja o primeiro a contribuir!
                                </Text>
                              </View>
                            )}
                          </View>
                          
                          <TouchableOpacity
                            style={[
                              styles.primaryActionButton,
                              { backgroundColor: module.completed ? theme.successGreen : theme.primaryBlue }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => {
                              navigation.navigate('ModuleContent', {
                                module: {
                                  ...module,
                                  index: index
                                },
                                trailTitle: trail.title
                              });
                            }}
                          >
                            <Text style={styles.actionIcon}>
                              {module.completed ? '🔄' : '🚀'}
                            </Text>
                            <Text style={styles.actionText}>
                              {module.completed ? 'Revisar Módulo' : 'Começar Agora'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                </View>
              );
            })}
            
            {/* Finish Flag */}
            <View style={styles.finishFlag}>
              <Text style={styles.flagIcon}>🏁</Text>
              <Text style={[styles.flagText, { color: theme.textColor }]}>
                {trail.progress === 100 ? 'Trilha Completa!' : 'Destino Final'}
              </Text>
            </View>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 50,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trailOverview: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  trailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  trailIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  trailInfo: {
    flex: 1,
  },
  trailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trailDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  achievementBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  achievementIcon: {
    fontSize: 28,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'right',
  },
  xpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  xpIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  xpText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modulesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gamifiedPath: {
    position: 'relative',
    paddingVertical: 10,
    overflow: 'visible',
  },
  pathRow: {
    marginBottom: 20,
  },
  gameModuleCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
    overflow: 'hidden',
  },
  cardContent: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  levelInfo: {
    flex: 1,
  },
  medalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  cardMedalEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  moduleNumber: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  gameModuleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameModuleDesc: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  cardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardStatIcon: {
    fontSize: 14,
  },
  cardStatText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  expandedActions: {
    marginTop: 12,
    paddingTop: 12,
  },
  divider: {
    height: 1,
    marginBottom: 12,
    borderRadius: 1,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    minHeight: 48,
  },
  actionIcon: {
    fontSize: 18,
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  finishFlag: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  flagIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  flagText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentsSection: {
    marginBottom: 16,
  },
  contentsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contentsList: {
    gap: 8,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contentTypeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  contentAuthor: {
    fontSize: 12,
  },
  contentArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContent: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
});
