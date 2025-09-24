import React, { useMemo, useState, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = memo(function HomeScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { colors, isDarkMode, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('todas');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Fechar menu quando a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSidebarOpen(false);
      setProfileDropdownOpen(false);
    });

    return unsubscribe;
  }, [navigation]);

  const newsData = [
    {
      icon: '🔬',
      title: 'Semana da Ciência 2024',
      subtitle: 'Divulgue seu trabalho!',
      info: 'Inscrições abertas até 15 de dezembro.',
      date: '18 a 22 de dezembro'
    },
    {
      icon: '🎓',
      title: 'Bolsa de Estudo 2025',
      subtitle: 'Inscrições abertas!',
      info: 'Processo seletivo para bolsas de estudo.',
      date: '1º a 31 de janeiro'
    },
    {
      icon: '📝',
      title: 'Período de Matrícula',
      subtitle: 'Não perca o prazo!',
      info: 'Matrículas para o próximo semestre.',
      date: '15 a 30 de janeiro'
    },
    {
      icon: '📚',
      title: 'Biblioteca Digital',
      subtitle: 'Novos recursos disponíveis!',
      info: 'Acesso a milhares de livros online.',
      date: 'Disponível 24h'
    }
  ];

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
    lightBlue: isDarkMode ? '#1e3a8a' : '#e6f3ff',
    darkBlue: isDarkMode ? '#3b82f6' : '#0066cc',
    lightGreen: isDarkMode ? '#16a34a' : '#4CAF50',
    newsCardBg: isDarkMode ? '#1e3a8a' : '#e6f3ff',
    newsTextColor: isDarkMode ? '#e2e8f0' : '#0066cc',
    navButtonBg: isDarkMode ? '#1e293b' : '#fff',
    navButtonBorder: isDarkMode ? '#334155' : 'rgba(0,0,0,0.1)',
  }), [colors, isDarkMode]);

  const trailsData = [
    {
      id: 1,
      title: 'Lógica de Programação',
      description: 'Pensamento computacional e algoritmos',
      icon: '💻',
      progress: 100,
      completed: 4,
      total: 4,
      category: 'base',
      achievementIcon: '🏆'
    },
    {
      id: 2,
      title: 'Programação Web',
      description: 'HTML, CSS, JavaScript e frameworks',
      icon: '🌐',
      progress: 75,
      completed: 3,
      total: 4,
      category: 'tecnica',
      achievementIcon: '🥉'
    },
    {
      id: 3,
      title: 'Banco de Dados',
      description: 'Modelagem e gerenciamento de dados',
      icon: '🗄️',
      progress: 50,
      completed: 2,
      total: 4,
      category: 'tecnica',
      achievementIcon: '🥉'
    },
    {
      id: 4,
      title: 'Matemática Discreta',
      description: 'Fundamentos matemáticos para computação',
      icon: '📊',
      progress: 25,
      completed: 1,
      total: 4,
      category: 'base',
      achievementIcon: '🥉'
    },
    {
      id: 5,
      title: 'Desenvolvimento Mobile',
      description: 'React Native e desenvolvimento nativo',
      icon: '📱',
      progress: 0,
      completed: 0,
      total: 4,
      category: 'tecnica',
      achievementIcon: '🥉'
    },
    {
      id: 6,
      title: 'Algoritmos e Estruturas',
      description: 'Complexidade e otimização de algoritmos',
      icon: '⚙️',
      progress: 0,
      completed: 0,
      total: 4,
      category: 'base',
      achievementIcon: '🥉'
    }
  ];

  const filteredTrails = trailsData.filter(trail => 
    activeFilter === 'todas' || trail.category === activeFilter
  );

  const currentNews = newsData[currentNewsIndex];

  const flatListRef = React.useRef(null);

  const goToPreviousNews = useCallback(() => {
    const newIndex = currentNewsIndex === 0 ? newsData.length - 1 : currentNewsIndex - 1;
    setCurrentNewsIndex(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }, [currentNewsIndex]);

  const goToNextNews = useCallback(() => {
    const newIndex = currentNewsIndex === newsData.length - 1 ? 0 : currentNewsIndex + 1;
    setCurrentNewsIndex(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }, [currentNewsIndex]);

  const renderNewsItem = useCallback(({ item, index }) => (
    <View style={[styles.newsCardContent, { backgroundColor: theme.newsCardBg }]}>
      <Text style={styles.newsIcon}>{item.icon}</Text>
      <Text style={[styles.newsTitle, { color: theme.newsTextColor }]}>{item.title}</Text>
      <Text style={[styles.newsSubtitle, { color: theme.newsTextColor }]}>{item.subtitle}</Text>
      <Text style={[styles.newsInfo, { color: theme.newsTextColor }]}>
        {item.info}
      </Text>
      <View style={styles.newsDate}>
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={[styles.dateText, { color: theme.newsTextColor }]}>{item.date}</Text>
      </View>
    </View>
  ), [theme]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentNewsIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header - Updated */}
      <View style={[styles.header, { backgroundColor: theme.cardBg }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.graduationIcon}>🎓</Text>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Portal do Estudante</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: isDarkMode ? theme.textColor + '20' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => toggle()}
          >
            <Text style={styles.themeIcon}>
              {isDarkMode ? '☀' : '🌙'}
            </Text>
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
                {user?.name || 'Usuário'}
              </Text>
            </TouchableOpacity>
            
            {/* Profile Dropdown */}
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
                      {user?.name || 'Usuário'}
                    </Text>
                    <Text style={[styles.dropdownUserRole, { color: theme.textColor + '88' }]}>Estudante</Text>
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

      <View style={styles.mainContent}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { backgroundColor: theme.cardBg }]}>
          {/* Menu Toggle Button */}
          <TouchableOpacity 
            style={[styles.menuToggleButton, { backgroundColor: theme.primaryBlue }]}
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            <Text style={styles.menuIcon}>☰</Text>
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>

          {/* Collapsible Menu Items */}
          {sidebarOpen && (
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={[styles.menuButton, { backgroundColor: theme.cardBg }]}
                onPress={() => navigation.navigate('CampusInfo')}
              >
                <Text style={styles.menuButtonIcon}>🗺️</Text>
                <Text style={[styles.menuButtonText, { color: theme.textColor }]}>Informações sobre o campus</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuButton, { backgroundColor: theme.cardBg }]}
                onPress={() => navigation.navigate('MySubmissions')}
              >
                <Text style={styles.menuButtonIcon}>📋</Text>
                <Text style={[styles.menuButtonText, { color: theme.textColor }]}>Minhas Submissões</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuButton, { backgroundColor: theme.primaryBlue }]}
                onPress={() => navigation.navigate('SubmitContent')}
              >
                <Text style={styles.menuButtonIcon}>➕</Text>
                <Text style={styles.menuButtonTextWhite}>Submeter Conteúdo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main Content Area */}
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
          {/* News Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>❗</Text>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Últimas Notícias e Avisos</Text>
            </View>
            <Text style={[styles.sectionSubtitle, { color: theme.textColor + '88' }]}>
              Fique por dentro das novidades do campus
            </Text>
            
            <View style={styles.newsCard}>
              <FlatList
                ref={flatListRef}
                data={newsData}
                renderItem={renderNewsItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled={false}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                style={styles.newsFlatList}
                contentContainerStyle={styles.newsFlatListContent}
                getItemLayout={(data, index) => ({
                  length: Dimensions.get('window').width,
                  offset: Dimensions.get('window').width * index,
                  index,
                })}
                removeClippedSubviews={true}
                maxToRenderPerBatch={2}
                windowSize={3}
                initialNumToRender={2}
                updateCellsBatchingPeriod={50}
              />
              
              <View style={styles.newsNavigation}>
                <TouchableOpacity 
                  style={[
                    styles.navButton, 
                    { 
                      backgroundColor: theme.navButtonBg,
                      borderColor: theme.navButtonBorder,
                      shadowColor: theme.textColor
                    }
                  ]} 
                  onPress={goToPreviousNews}
                >
                  <Text style={[styles.navIcon, { color: theme.primaryBlue }]}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.navButton, 
                    { 
                      backgroundColor: theme.navButtonBg,
                      borderColor: theme.navButtonBorder,
                      shadowColor: theme.textColor
                    }
                  ]} 
                  onPress={goToNextNews}
                >
                  <Text style={[styles.navIcon, { color: theme.primaryBlue }]}>→</Text>
                </TouchableOpacity>
              </View>
              
              {/* News Indicators */}
              <View style={styles.newsIndicators}>
                {newsData.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.indicator,
                      { backgroundColor: index === currentNewsIndex ? theme.primaryBlue : theme.textColor + '40' }
                    ]}
                    onPress={() => {
                      setCurrentNewsIndex(index);
                      flatListRef.current?.scrollToIndex({ index, animated: true });
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Trails Section */}
          <View style={styles.section}>
            <View style={styles.trailsHeader}>
              <View style={styles.trailsTitleContainer}>
                <Text style={styles.trailsIcon}>🎯</Text>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                  Trilhas do Curso de Informática
                </Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: theme.textColor + '88' }]}>
                Desenvolva suas habilidades técnicas através de trilhas estruturadas
              </Text>
            </View>
            
            {/* Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterIcon}>🔽</Text>
                <Text style={[styles.filterLabel, { color: theme.textColor }]}>Filtrar por:</Text>
              </View>
              
              <View style={styles.filterButtons}>
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    activeFilter === 'todas' && styles.filterButtonActive, 
                    { backgroundColor: activeFilter === 'todas' ? theme.darkBlue : theme.lightBlue }
                  ]}
                  onPress={() => setActiveFilter('todas')}
                >
                  <Text style={[styles.filterButtonIcon, { color: activeFilter === 'todas' ? '#fff' : theme.textColor }]}>🎓</Text>
                  <Text style={[styles.filterButtonText, { color: activeFilter === 'todas' ? '#fff' : theme.textColor }]}>Todas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    activeFilter === 'tecnica' && styles.filterButtonActive, 
                    { backgroundColor: activeFilter === 'tecnica' ? theme.lightGreen : theme.lightBlue }
                  ]}
                  onPress={() => setActiveFilter('tecnica')}
                >
                  <Text style={[styles.filterButtonIcon, { color: activeFilter === 'tecnica' ? '#fff' : theme.textColor }]}>&lt; &gt;</Text>
                  <Text style={[styles.filterButtonText, { color: activeFilter === 'tecnica' ? '#fff' : theme.textColor }]}>Técnicas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    activeFilter === 'base' && styles.filterButtonActive, 
                    { backgroundColor: activeFilter === 'base' ? theme.primaryBlue : theme.lightBlue }
                  ]}
                  onPress={() => setActiveFilter('base')}
                >
                  <Text style={[styles.filterButtonIcon, { color: activeFilter === 'base' ? '#fff' : theme.textColor }]}>📚</Text>
                  <Text style={[styles.filterButtonText, { color: activeFilter === 'base' ? '#fff' : theme.textColor }]}>Base</Text>
                </TouchableOpacity>
              </View>
              
            </View>
            
            {/* Trail Cards */}
            <View style={styles.trailsContainer}>
              {filteredTrails.map((trail) => (
                <TouchableOpacity 
                  key={trail.id} 
                  style={[styles.trailCard, { backgroundColor: theme.cardBackground }]}
                  onPress={() => navigation.navigate('TrailDetail', { trail })}
                >
                  <View style={styles.trailCardHeader}>
                    <Text style={styles.trailCardIcon}>{trail.icon}</Text>
                    <View style={styles.trailCardInfo}>
                      <Text style={[styles.trailCardTitle, { color: theme.textColor }]}>{trail.title}</Text>
                      <Text style={[styles.trailCardDescription, { color: theme.textColor + '88' }]}>
                        {trail.description}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.trailCardFooter}>
                    <View style={styles.progressSection}>
                      <Text style={[styles.progressLabel, { color: theme.textColor + '88' }]}>Progresso</Text>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { backgroundColor: theme.textColor + '20' }]}>
                          <View style={[
                            styles.progressFill, 
                            { 
                              backgroundColor: trail.progress === 100 ? '#FFA500' : '#ccc',
                              width: `${trail.progress}%` 
                            }
                          ]} />
                        </View>
                        <Text style={[styles.progressText, { color: theme.textColor }]}>
                          {trail.completed}/{trail.total}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.trophyIcon}>{trail.achievementIcon}</Text>
                  </View>
        </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    elevation: 3,
    zIndex: 100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '60%',
  },
  graduationIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '40%',
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    maxWidth: 140,
    minWidth: 80,
  },
  userIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  userIcon: {
    fontSize: 14,
  },
  userProfileImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
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
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 10000,
  },
  dropdownUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownUserIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dropdownProfileIcon: {
    fontSize: 20,
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
  dropdownUserRole: {
    fontSize: 14,
  },
  dropdownSeparator: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  dropdownMenuIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  dropdownMenuText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  sidebar: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  menuToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    minWidth: 120,
  },
  menuIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 8,
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuItems: {
    marginTop: 10,
    gap: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
    minHeight: 45,
  },
  menuButtonIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  menuButtonTextWhite: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
    alignSelf: 'stretch',
  },
  sidebarIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sidebarText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  submitIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#fff',
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  section: {
    marginBottom: 30,
    width: '100%',
    maxWidth: 800,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  upArrow: {
    fontSize: 16,
    color: '#1e90ff',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  newsCard: {
    position: 'relative',
    alignItems: 'center',
  },
  newsFlatList: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  newsFlatListContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsCardContent: {
    padding: 30,
    borderRadius: 20,
    marginBottom: 10,
    width: Dimensions.get('window').width - 40,
    maxWidth: 500,
    marginLeft: 0,
    marginRight: 40,
    alignSelf: 'center',
    aspectRatio: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsIcon: {
    fontSize: 32,
    marginBottom: 15,
  },
  newsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  newsSubtitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  newsInfo: {
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  newsDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  newsNavigation: {
    position: 'absolute',
    top: '50%',
    left: -15,
    right: -15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    transform: [{ translateY: -20 }],
  },
  navButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
  },
  navIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  newsIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trailsHeader: {
    marginBottom: 20,
  },
  trailsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trailsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#1e90ff',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  filterButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonIcon: {
    fontSize: 16,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trailsContainer: {
    gap: 16,
  },
  trailCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trailCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  trailCardIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  trailCardInfo: {
    flex: 1,
  },
  trailCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trailCardDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  trailCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressSection: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trophyIcon: {
    fontSize: 32,
  },
});


