import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { user, updateProfilePhoto, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo || null);
  const [coverPhoto, setCoverPhoto] = useState(user?.cover_photo || null);

  const theme = {
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    inputBackground: isDarkMode ? '#334155' : '#f8f9fa',
    inputBorder: isDarkMode ? '#475569' : '#e2e8f0',
    primaryBlue: '#1e90ff',
    successGreen: '#4CAF50',
    dangerRed: '#ef4444',
  };

  const selectProfileImage = async () => {
    try {
      setIsLoading(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfilePhoto(imageUri);
        await updateProfilePhoto(imageUri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto de perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCoverImage = async () => {
    try {
      setIsLoading(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCoverPhoto(imageUri);
        // Aqui vamos implementar a atualização da foto de capa
        await updateProfile({ cover_photo: imageUri });
      }
    } catch (error) {
      console.error('Erro ao selecionar foto de capa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de capa.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setIsLoading(true);
      
      await updateProfile({ 
        bio: bio.trim(),
        cover_photo: coverPhoto 
      });
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.inputBorder }]}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.headerButtonText, { color: theme.primaryBlue }]}>Cancelar</Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Editar Perfil</Text>
          
          <TouchableOpacity 
            style={[styles.headerButton, styles.saveButton, { backgroundColor: theme.primaryBlue }]}
            onPress={saveProfile}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Cover Photo Section */}
          <View style={styles.coverSection}>
            <TouchableOpacity 
              style={[styles.coverPhotoContainer, { backgroundColor: theme.inputBackground }]}
              onPress={selectCoverImage}
              disabled={isLoading}
            >
              {coverPhoto ? (
                <Image
                  source={{ uri: coverPhoto }}
                  style={styles.coverPhoto}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Text style={styles.coverIcon}>📷</Text>
                  <Text style={[styles.coverText, { color: theme.textColor }]}>Adicionar foto de capa</Text>
                </View>
              )}
              <View style={[styles.coverOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile Photo Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={[styles.profilePhotoContainer, { backgroundColor: theme.cardBackground, borderColor: theme.inputBorder }]}
              onPress={selectProfileImage}
              disabled={isLoading}
            >
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profilePhoto}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profileIcon}>👤</Text>
                </View>
              )}
              <View style={[styles.profileOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
            
            <Text style={[styles.profileLabel, { color: theme.textColor }]}>
              {user?.name || 'Usuário'}
            </Text>
          </View>

          {/* Bio Section */}
          <View style={[styles.bioSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Biografia</Text>
            <TextInput
              style={[
                styles.bioInput,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textColor,
                }
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor={theme.textColor + '66'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.textColor + '66' }]}>
              {bio.length}/500 caracteres
            </Text>
          </View>

          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Informações</Text>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '66' }]}>Nome</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>{user?.name || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '66' }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>{user?.email || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor + '66' }]}>Matrícula</Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>{user?.matricula || 'Não informado'}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
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
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    marginBottom: 20,
  },
  coverPhotoContainer: {
    width: width,
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  coverText: {
    fontSize: 16,
    fontWeight: '500',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: -50,
  },
  profilePhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  profilePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 40,
  },
  profileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  profileLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editIcon: {
    fontSize: 20,
    color: '#fff',
  },
  bioSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  infoSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
