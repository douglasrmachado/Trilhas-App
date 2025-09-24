import React, { useMemo, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  SafeAreaView,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getApiUrl } from '../config/api';

export default function ProfessorHomeScreen({ navigation }) {
  const { user, logout, token } = useAuth();
  const { colors, isDarkMode, toggle } = useTheme();
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedFilter1, setSelectedFilter1] = useState('Todos');
  const [selectedFilter2, setSelectedFilter2] = useState('Todas');
  const [selectedFilter3, setSelectedFilter3] = useState('Todos');
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
    lightBlue: '#e6f3ff',
    darkBlue: '#0066cc',
    lightGreen: '#4CAF50',
    warningOrange: '#f59e0b',
  }), [colors, isDarkMode]);

  useEffect(() => {
    loadPendingSubmissions();
  }, []);

  // Fechar dropdown quando a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setProfileDropdownOpen(false);
    });

    return unsubscribe;
  }, [navigation]);

  const loadPendingSubmissions = async () => {
    try {
      const apiUrl = getApiUrl();
      console.log('⏳ Carregando submissões pendentes...');

      const response = await fetch(`${apiUrl}/submissions/pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Submissões pendentes carregadas:', result.data.length);
        setPendingSubmissions(result.data);
      } else {
        throw new Error(result.message || 'Erro ao carregar submissões pendentes');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar submissões pendentes:', error);
      Alert.alert('Erro', 'Erro ao carregar submissões pendentes');
    } finally {
      setLoadingSubmissions(false);
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header - Estilo consistente com HomeScreen */}
      <View style={[styles.header, { backgroundColor: theme.cardBg }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.graduationIcon}>🎓</Text>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Área do Professor</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: isDarkMode ? theme.textColor + '20' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => toggle()}
          >
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          
          <View style={styles.profileContainer}>
            <TouchableOpacity 
              style={styles.userInfo}
              onPress={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              {user?.profile_photo ? (
                <Image 
                  source={{ uri: user.profile_photo }} 
                  style={styles.userProfileImage}
                />
              ) : (
                <View style={styles.userIconContainer}>
                  <Text style={styles.userIcon}>👤</Text>
                </View>
              )}
              <Text style={[styles.userName, { color: theme.textColor }]}>
                {user?.name || 'Professor'}
              </Text>
            </TouchableOpacity>
            
            {/* Profile Dropdown - Estilo idêntico ao HomeScreen */}
            {profileDropdownOpen && (
              <View style={[styles.profileDropdown, { backgroundColor: theme.cardBackground, shadowColor: theme.textColor }]}>
                {/* User Info Section */}
                <View style={styles.dropdownUserInfo}>
                  <View style={styles.dropdownUserIcon}>
                    {user?.profile_photo ? (
                      <Image 
                        source={{ uri: user.profile_photo }} 
                        style={styles.dropdownProfileImage}
                      />
                    ) : (
                      <Text style={styles.dropdownProfileIcon}>👤</Text>
                    )}
                  </View>
                  <View style={styles.dropdownUserDetails}>
                    <Text style={[styles.dropdownUserName, { color: theme.textColor }]}>
                      {user?.name || 'Professor'}
                    </Text>
                    <Text style={[styles.dropdownUserEmail, { color: theme.textColor }]}>
                      {user?.email || 'professor@instituto.edu.br'}
                    </Text>
                  </View>
                </View>
                
                {/* Separator */}
                <View style={[styles.dropdownSeparator, { backgroundColor: theme.textColor + '20' }]} />
                
                {/* Menu Items */}
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    console.log('Clicou em Visualizar Perfil');
                    setProfileDropdownOpen(false);
                    navigation.navigate('UserProfile');
                  }}
                >
                  <Text style={styles.dropdownMenuIcon}>👤</Text>
                  <Text style={[styles.dropdownMenuText, { color: theme.textColor }]}>Visualizar Perfil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    console.log('Clicou em Configurações');
                    setProfileDropdownOpen(false);
                    // TODO: Implementar tela de configurações
                    alert('Funcionalidade de configurações em desenvolvimento');
                  }}
                >
                  <Text style={styles.dropdownMenuIcon}>⚙️</Text>
                  <Text style={[styles.dropdownMenuText, { color: theme.textColor }]}>Configurações</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                >
                  <Text style={styles.dropdownMenuIcon}>🚪</Text>
                  <Text style={[styles.dropdownMenuText, { color: '#ff4444' }]}>Sair</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.contentArea} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        onTouchStart={() => {
          if (profileDropdownOpen) {
            setProfileDropdownOpen(false);
          }
        }}
      >
        {/* Filters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔽</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Filtros</Text>
          </View>
          
          <View style={styles.filtersContainer}>
            <TouchableOpacity style={[styles.filterDropdown, { backgroundColor: theme.cardBg, borderColor: theme.textColor + '20' }]}>
              <Text style={[styles.filterText, { color: theme.textColor }]}>{selectedFilter1}</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.filterDropdown, { backgroundColor: theme.cardBg, borderColor: theme.textColor + '20' }]}>
              <Text style={[styles.filterText, { color: theme.textColor }]}>{selectedFilter2}</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.filterDropdown, { backgroundColor: theme.cardBg, borderColor: theme.textColor + '20' }]}>
              <Text style={[styles.filterText, { color: theme.textColor }]}>{selectedFilter3}</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Content Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📄</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Conteúdos Pendentes ({pendingSubmissions.length})
            </Text>
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: theme.primaryBlue }]}
              onPress={() => navigation.navigate('ReviewedSubmissions')}
            >
              <Text style={styles.reviewButtonText}>Submissões Revisadas</Text>
            </TouchableOpacity>
          </View>

          {loadingSubmissions ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.textColor }]}>
                Carregando submissões pendentes...
              </Text>
            </View>
          ) : pendingSubmissions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
                Nenhuma submissão pendente
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textColor + '88' }]}>
                Não há conteúdos aguardando revisão
              </Text>
            </View>
          ) : (
            pendingSubmissions.map((submission) => (
            <TouchableOpacity 
              key={submission.id} 
              style={[styles.contentCard, { backgroundColor: theme.cardBg }]}
              onPress={() => navigation.navigate('SubmissionDetail', { submission })}
            >
              {/* Content Header */}
              <View style={styles.contentHeader}>
                <Text style={styles.contentIcon}>
                  {submission.content_type === 'resumo' ? '📄' : 
                   submission.content_type === 'mapa' ? '🗺️' : 
                   submission.content_type === 'exercicio' ? '📝' : '📊'}
                </Text>
                <View style={styles.contentInfo}>
                  <Text style={[styles.contentTitle, { color: theme.textColor }]}>{submission.title}</Text>
                  <View style={styles.contentMeta}>
                    <Text style={[styles.contentAuthor, { color: theme.textColor }]}>Por: {submission.user_name || 'Estudante'}</Text>
                    <Text style={styles.contentDot}>•</Text>
                    <Text style={styles.contentDateIcon}>📅</Text>
                    <Text style={[styles.contentDate, { color: theme.textColor }]}>{new Date(submission.created_at).toLocaleDateString('pt-BR')}</Text>
                  </View>
                  <View style={styles.tagsContainer}>
                    <View style={[styles.tag, { backgroundColor: theme.primaryBlue + '20' }]}>
                      <Text style={styles.tagIcon}>🎓</Text>
                      <Text style={[styles.tagText, { color: theme.primaryBlue }]}>{submission.year}</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: theme.primaryBlue + '20' }]}>
                      <Text style={styles.tagIcon}>📚</Text>
                      <Text style={[styles.tagText, { color: theme.primaryBlue }]}>{submission.subject}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Content Description */}
              <Text style={[styles.contentDescription, { color: theme.textColor + 'CC' }]}>
                {submission.description}
              </Text>

              {/* Status Badge */}
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: theme.warningOrange + '20' }]}>
                  <Text style={[styles.statusText, { color: theme.warningOrange }]}>⏳ Pendente</Text>
                </View>
              </View>
            </TouchableOpacity>
            ))
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1000,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graduationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    maxWidth: '50%',
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  themeIcon: {
    fontSize: 18,
  },
  profileContainer: {
    position: 'relative',
    zIndex: 10000,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: 120,
    minWidth: 80,
  },
  userIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  userIcon: {
    fontSize: 14,
  },
  userProfileImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
    marginLeft: 4,
  },
  profileDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 99999,
  },
  dropdownUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownUserIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dropdownProfileIcon: {
    fontSize: 18,
    color: '#fff',
  },
  dropdownProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dropdownUserDetails: {
    flex: 1,
  },
  dropdownUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dropdownUserEmail: {
    fontSize: 12,
    opacity: 0.7,
  },
  dropdownSeparator: {
    height: 1,
    marginVertical: 12,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dropdownMenuIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  dropdownMenuText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  reviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
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
  filtersContainer: {
    gap: 10,
  },
  filterDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
  },
  filterArrow: {
    fontSize: 12,
    color: '#666',
  },
  contentCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  contentIcon: {
    fontSize: 20,
    marginRight: 15,
    marginTop: 2,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contentAuthor: {
    fontSize: 14,
    color: '#666',
  },
  contentDot: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  contentDateIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  contentDate: {
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  summaryIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#fff',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  actionButtons: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  feedbackButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#fff',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});