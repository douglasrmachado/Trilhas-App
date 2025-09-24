import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CampusInfoScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const theme = {
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
    successGreen: '#4CAF50',
    dangerRed: '#ef4444',
    warningOrange: '#FF9800',
    purple: '#8B5CF6',
    lightBlue: isDarkMode ? '#1e3a8a' : '#e6f3ff',
    lightGreen: isDarkMode ? '#16a34a' : '#e8f5e8',
    lightPurple: isDarkMode ? '#7c3aed' : '#f3e8ff',
  };

  const handleOpenYouTube = () => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=m1ZfxVfuyO4&t=93s';
    Linking.openURL(youtubeUrl).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o YouTube');
    });
  };

  const handleOpenGoogleMaps = () => {
    const mapsUrl = 'https://maps.app.goo.gl/3ppfoDLHtYNPV1bQ6';
    Linking.openURL(mapsUrl).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps');
    });
  };

  const campusInfo = [
    {
      id: 1,
      icon: '📍',
      title: 'Endereço',
      content: [
        'Rua Antônio Carlos Rodrigues, 453',
        'Porto Seguro, Paranaguá - PR',
        'CEP: 83215-750'
      ],
      backgroundColor: theme.lightBlue,
    },
    {
      id: 2,
      icon: '📞',
      title: 'Contato',
      content: [
        'Telefone: (41) 2102-3200',
        'E-mail: paranagua@ifpr.edu.br'
      ],
      backgroundColor: theme.lightGreen,
    },
    {
      id: 3,
      icon: '🏢',
      title: 'Sobre o Campus',
      content: [
        'O Campus Paranaguá oferece cursos técnicos e superiores na área de tecnologia, formando profissionais qualificados para o mercado de trabalho regional.'
      ],
      backgroundColor: theme.lightPurple,
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.textColor + '20' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: theme.textColor }]}>←</Text>
          <Text style={[styles.backText, { color: theme.textColor }]}>Voltar</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>📢</Text>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Informações...</Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Section */}
        <View style={[styles.videoCard, { backgroundColor: theme.cardBackground, shadowColor: theme.textColor }]}>
          <Text style={[styles.videoTitle, { color: theme.textColor }]}>
            Conhecendo o IFPR - Campus Paranaguá
          </Text>
          <Text style={[styles.videoSubtitle, { color: theme.textColor + '80' }]}>
            Tour virtual pelo nosso campus
          </Text>
          
          {/* Video Player */}
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: 'https://www.youtube.com/embed/m1ZfxVfuyO4?start=93&autoplay=0&rel=0' }}
              style={styles.videoPlayer}
              onLoadStart={() => setIsVideoLoading(true)}
              onLoadEnd={() => setIsVideoLoading(false)}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
            />
            
            {/* YouTube Button */}
            <TouchableOpacity 
              style={[styles.youtubeButton, { backgroundColor: '#FF0000' }]}
              onPress={handleOpenYouTube}
            >
              <Text style={styles.youtubeText}>Assista no</Text>
              <Text style={styles.youtubeLogo}>YouTube</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Campus Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Informações do Campus
            </Text>
          </View>
          
          {campusInfo.map((info) => (
            <View 
              key={info.id} 
              style={[
                styles.infoCard, 
                { backgroundColor: info.backgroundColor, shadowColor: theme.textColor }
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{info.icon}</Text>
                <Text style={[styles.cardTitle, { color: theme.textColor }]}>
                  {info.title}
                </Text>
              </View>
              
              <View style={styles.cardContent}>
                {info.content.map((line, index) => (
                  <Text 
                    key={index} 
                    style={[styles.cardText, { color: theme.textColor }]}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Map Section */}
        <View style={[styles.mapCard, { backgroundColor: theme.cardBackground, shadowColor: theme.textColor }]}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapIcon}>📍</Text>
            <Text style={[styles.mapTitle, { color: theme.textColor }]}>
              Localização do Campus
            </Text>
          </View>
          
          <Text style={[styles.mapSubtitle, { color: theme.textColor + '80' }]}>
            Encontre-nos no mapa
          </Text>
          
          {/* Map Container */}
          <View style={styles.mapContainer}>
            <TouchableOpacity 
              style={styles.mapImageContainer}
              onPress={handleOpenGoogleMaps}
              activeOpacity={0.8}
            >
              <View style={[styles.mapPlaceholder, { backgroundColor: theme.inputBackground }]}>
                <Text style={styles.mapIconLarge}>🗺️</Text>
                <Text style={[styles.mapPlaceholderText, { color: theme.textColor }]}>
                  Campus IFPR Paranaguá
                </Text>
                <Text style={[styles.mapPlaceholderSubtext, { color: theme.textColor + '80' }]}>
                  Rua Antônio Carlos Rodrigues, 453
                </Text>
                <Text style={[styles.mapPlaceholderSubtext, { color: theme.textColor + '80' }]}>
                  Porto Seguro, Paranaguá - PR
                </Text>
              </View>
              
              {/* Map Controls Overlay */}
              <View style={styles.mapControls}>
                <View style={styles.mapZoomControls}>
                  <View style={styles.zoomButton}>
                    <Text style={styles.zoomText}>+</Text>
                  </View>
                  <View style={styles.zoomButton}>
                    <Text style={styles.zoomText}>-</Text>
                  </View>
                </View>
              </View>
              
              {/* Google Maps Button */}
              <TouchableOpacity 
                style={[styles.mapsButton, { backgroundColor: theme.cardBackground, shadowColor: theme.textColor }]}
                onPress={handleOpenGoogleMaps}
              >
                <Text style={styles.mapsIcon}>📍</Text>
                <Text style={[styles.mapsText, { color: theme.textColor }]}>
                  Abrir no Google Maps
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 80,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  videoCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  videoSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  youtubeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  youtubeText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
  },
  youtubeLogo: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    marginLeft: 28,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  mapCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  mapContainer: {
    position: 'relative',
  },
  mapImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  mapIconLarge: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  mapControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  mapZoomControls: {
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  zoomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mapsButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapsIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mapsText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
