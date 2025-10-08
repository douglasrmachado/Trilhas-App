import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const themed = useMemo(() => ({
    background: colors.background,
    text: colors.text,
    inputBorder: colors.text + '33',
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    primary: '#1e90ff',
  }), [colors, isDarkMode]);

  async function handleSave() {
    try {
      if (!name || name.trim().length < 2) {
        Alert.alert('Atenção', 'Informe um nome válido (mín. 2 caracteres)');
        return;
      }
      setSaving(true);
      await updateProfile({ name, bio });
      Alert.alert('Sucesso', 'Perfil atualizado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar seu perfil.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={themed.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: themed.text }]}>←</Text>
          <Text style={[styles.backText, { color: themed.text }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themed.text }]}>Editar Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: themed.cardBg, shadowColor: themed.text }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themed.text }]}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor={themed.text + '66'}
              style={[styles.input, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themed.text }]}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Fale um pouco sobre você"
              placeholderTextColor={themed.text + '66'}
              multiline
              numberOfLines={4}
              style={[styles.textarea, { borderColor: themed.inputBorder, color: themed.text, backgroundColor: isDarkMode ? '#334155' : '#fff' }]}
            />
          </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: themed.primary }]} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


