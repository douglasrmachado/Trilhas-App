import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { user, updateProfilePhoto } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const selectImage = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permissão para acessar a galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
        return;
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await updateProfilePhoto(imageUri);
        Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const theme = {
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
    lightBlue: isDarkMode ? '#1e3a8a' : '#e6f3ff',
    successGreen: '#4CAF50',
    lightGreen: isDarkMode ? '#16a34a' : '#e8f5e8',
    warningOrange: '#FF9800',
    lightOrange: isDarkMode ? '#ea580c' : '#fff3e0',
    gold: '#FFD700',
    lightGold: isDarkMode ? '#fbbf24' : '#fff8dc',
    // Cores de fundo para modo escuro
    statsBgBlue: isDarkMode ? '#1e3a8a' : '#e6f3ff',
    statsBgGreen: isDarkMode ? '#16a34a' : '#e8f5e8',
    statsBgOrange: isDarkMode ? '#ea580c' : '#fff3e0',
  };

  const stats = [
    {
      id: 1,
      value: '125',
      label: 'Pontos',
      color: theme.primaryBlue,
      backgroundColor: theme.statsBgBlue,
    },
    {
      id: 2,
      value: '2',
      label: 'Aprovados',
      color: theme.successGreen,
      backgroundColor: theme.statsBgGreen,
    },
    {
      id: 3,
      value: '2',
      label: 'Conquistas',
      color: theme.warningOrange,
      backgroundColor: theme.statsBgOrange,
    }
  ];


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: theme.textColor }]}>←</Text>
          <Text style={[styles.backText, { color: theme.textColor }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Meu Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground, shadowColor: theme.textColor }]}>
          {/* Cover Image Area */}
          <View style={styles.coverImageArea}>
            {user?.cover_photo ? (
              <Image 
                source={{ uri: user.cover_photo }} 
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.gradientBackground} />
            )}
          </View>
          
          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity 
              style={[styles.profilePicture, { backgroundColor: theme.primaryBlue }]}
              onPress={selectImage}
              disabled={isLoading}
            >
              {user?.profile_photo ? (
                <Image 
                  source={{ uri: user.profile_photo }} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.profileInitials}>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Edit Profile Button */}
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: theme.primaryBlue }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editIcon}>✏️</Text>
              <Text style={styles.editText}>
                Editar Perfil
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* User Info */}
          <View style={styles.userInfoSection}>
            <Text style={[styles.userName, { color: theme.textColor }]}>
              {user?.name || 'Usuário'}
            </Text>
            <Text style={[styles.userRole, { color: theme.textColor + '88' }]}>Estudante</Text>
            {user?.bio ? (
              <Text style={[styles.bioText, { color: theme.textColor + '88' }]}>
                {user.bio}
              </Text>
            ) : (
              <Text style={[styles.personalizeText, { color: theme.textColor + '66' }]}>
                Personalize seu perfil adicionando uma foto e capa!
              </Text>
            )}
          </View>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: theme.cardBackground, shadowColor: theme.textColor }]}>
          {/* Statistics */}
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.id} style={[styles.statBox, { backgroundColor: stat.backgroundColor }]}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textColor }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
          
          {/* Redeem Reward Button */}
          <TouchableOpacity style={[styles.redeemButton, { backgroundColor: theme.gold }]}>
            <Text style={styles.redeemIcon}>🎁</Text>
            <Text style={styles.redeemText}>Resgatar Recompensa</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 80,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    borderRadius: 16,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  coverImageArea: {
    height: 120,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
    background: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)',
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editIcon: {
    fontSize: 16,
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userInfoSection: {
    padding: 20,
    paddingTop: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    marginBottom: 12,
  },
  personalizeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  redeemIcon: {
    fontSize: 18,
  },
  redeemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
