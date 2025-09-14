import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function TrailDetailScreen({ route, navigation }) {
  const { trail } = route.params;
  const { colors, isDarkMode } = useTheme();
  const [selectedModule, setSelectedModule] = useState(null);

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

  const modules = [
    {
      id: 1,
      title: `${trail.title} I`,
      description: 'Fundamentos e conceitos básicos',
      resources: 12,
      completed: true,
      xp: 100,
      badge: '🥇'
    },
    {
      id: 2,
      title: `${trail.title} II`,
      description: 'Avançando nos conceitos',
      resources: 15,
      completed: trail.progress >= 50,
      xp: 150,
      badge: trail.progress >= 50 ? '🥈' : '🔒'
    },
    {
      id: 3,
      title: `${trail.title} III`,
      description: 'Aplicações práticas',
      resources: 18,
      completed: trail.progress >= 75,
      xp: 200,
      badge: trail.progress >= 75 ? '🥉' : '🔒'
    },
    {
      id: 4,
      title: `${trail.title} IV`,
      description: 'Projeto final e certificação',
      resources: 25,
      completed: trail.progress === 100,
      xp: 300,
      badge: trail.progress === 100 ? '🏆' : '🔒'
    }
  ];

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: theme.textColor }]}>←</Text>
        </TouchableOpacity>
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

        {/* Modules Path */}
        <View style={styles.modulesSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Caminho de Aprendizado</Text>
          
          <View style={styles.modulesContainer}>
            {modules.map((module, index) => (
              <View key={module.id} style={styles.moduleItem}>
                {/* Connection Line */}
                {index < modules.length - 1 && (
                  <View style={[
                    styles.connectionLine,
                    { backgroundColor: module.completed ? theme.successGreen : theme.textColor + '30' }
                  ]} />
                )}
                
                {/* Module Card */}
                <TouchableOpacity
                  style={[
                    styles.moduleCard,
                    { backgroundColor: theme.cardBackground },
                    module.completed && styles.moduleCompleted
                  ]}
                  onPress={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                >
                  <View style={styles.moduleHeader}>
                    <View style={[
                      styles.moduleStatus,
                      { backgroundColor: module.completed ? theme.successGreen : theme.textColor + '30' }
                    ]}>
                      <Text style={styles.statusIcon}>
                        {module.completed ? '✓' : '○'}
                      </Text>
                    </View>
                    
                    <View style={styles.moduleInfo}>
                      <Text style={[styles.moduleTitle, { color: theme.textColor }]}>
                        {module.title}
                      </Text>
                      <Text style={[styles.moduleDescription, { color: theme.textColor + '88' }]}>
                        {module.description}
                      </Text>
                    </View>
                    
                    <View style={styles.moduleBadge}>
                      <Text style={styles.badgeIcon}>{module.badge}</Text>
                    </View>
                  </View>

                  {/* Expanded Content */}
                  {selectedModule === module.id && (
                    <View style={styles.moduleExpanded}>
                      <View style={styles.moduleStats}>
                        <View style={styles.statItem}>
                          <Text style={styles.statIcon}>📚</Text>
                          <Text style={[styles.statText, { color: theme.textColor }]}>
                            {module.resources} recursos
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statIcon}>⭐</Text>
                          <Text style={[styles.statText, { color: theme.textColor }]}>
                            {module.xp} XP
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: module.completed ? theme.successGreen : theme.primaryBlue }
                        ]}
                      >
                        <Text style={styles.actionIcon}>📖</Text>
                        <Text style={styles.actionText}>
                          {module.completed ? 'Revisar Conteúdos' : 'Iniciar Módulo'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Achievement Section */}
        <View style={[styles.achievementSection, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {modules.map((module, index) => (
              <View key={module.id} style={styles.achievementItem}>
                <View style={[
                  styles.achievementCircle,
                  { backgroundColor: module.completed ? theme.successGreen : theme.textColor + '20' }
                ]}>
                  <Text style={styles.achievementNumber}>{index + 1}</Text>
                </View>
                <Text style={[styles.achievementText, { color: theme.textColor }]}>
                  {module.completed ? 'Concluído' : 'Bloqueado'}
                </Text>
              </View>
            ))}
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
  backButton: {
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
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
  modulesContainer: {
    position: 'relative',
  },
  moduleItem: {
    position: 'relative',
    marginBottom: 20,
  },
  connectionLine: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 2,
    height: 40,
    zIndex: 1,
  },
  moduleCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleCompleted: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  moduleStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  statusIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  moduleBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 24,
  },
  moduleExpanded: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  moduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementSection: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
