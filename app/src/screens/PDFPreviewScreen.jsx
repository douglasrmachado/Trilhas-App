import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

export default function PDFPreviewScreen({ route, navigation }) {
  const { fileUrl, fileName, title } = route.params;
  const { colors, isDarkMode } = useTheme();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const theme = useMemo(() => ({
    backgroundColor: colors.background,
    textColor: colors.text,
    cardBackground: isDarkMode ? '#1e293b' : '#fff',
    primaryBlue: '#1e90ff',
  }), [colors, isDarkMode]);

  // URL com autenticação para o WebView
  const pdfUrl = `${fileUrl}?token=${token}`;

  // Para Android, podemos usar o Google Docs Viewer
  const viewerUrl = Platform.OS === 'android' 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
    : pdfUrl;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      const localFileName = fileName || 'documento.pdf';
      const localUri = FileSystem.documentDirectory + localFileName;
      
      console.log('📥 Iniciando download:', { fileUrl, localFileName });
      
      const downloadResult = await FileSystem.downloadAsync(
        fileUrl,
        localUri,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      console.log('✅ Download concluído:', downloadResult.uri);
      
      if (downloadResult.status === 200) {
        try {
          if (Platform.OS === 'android') {
            const contentUri = await FileSystem.getContentUriAsync(downloadResult.uri);
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: contentUri,
              flags: 1,
              type: 'application/pdf',
            });
          } else {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(downloadResult.uri, {
                mimeType: 'application/pdf',
                dialogTitle: `Salvar ${localFileName}`,
                UTI: 'com.adobe.pdf',
              });
            } else {
              Alert.alert('Sucesso', 'Arquivo baixado com sucesso!');
            }
          }
        } catch (openError) {
          console.error('❌ Erro ao abrir arquivo:', openError);
          Alert.alert(
            'Arquivo Baixado',
            'O arquivo foi baixado com sucesso!',
            [{ text: 'OK' }]
          );
        }
      } else {
        throw new Error(`Download falhou com status ${downloadResult.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao baixar:', error);
      Alert.alert('Erro', 'Não foi possível baixar o arquivo. Tente novamente.');
    } finally {
      setDownloading(false);
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
          <Text style={[styles.headerTitle, { color: theme.textColor }]} numberOfLines={1}>
            {title || 'Visualizar PDF'}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: theme.primaryBlue }]}
            onPress={handleDownload}
            disabled={downloading}
          >
            <Text style={styles.downloadIcon}>
              {downloading ? '⏳' : '💾'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView com PDF */}
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.primaryBlue} />
            <Text style={[styles.loadingText, { color: theme.textColor }]}>
              Carregando documento...
            </Text>
          </View>
        )}
        
        <WebView
          source={{ 
            uri: viewerUrl,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('❌ Erro no WebView:', nativeEvent);
            Alert.alert(
              'Erro ao carregar',
              'Não foi possível visualizar o PDF. Deseja baixar o arquivo?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Baixar', onPress: handleDownload }
              ]
            );
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
        />
      </View>

      {/* Hint de navegação */}
      <View style={[styles.hintBar, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.hintText, { color: theme.textColor + '88' }]}>
          💡 Dica: Use gestos de pinça para dar zoom no documento
        </Text>
      </View>
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
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadIcon: {
    fontSize: 20,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#525659',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  hintBar: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
  },
});

