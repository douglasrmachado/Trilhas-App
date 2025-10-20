import Constants from 'expo-constants';

// Configuração da API
export const API_CONFIG = {
  // Para desenvolvimento local
  LOCAL: 'http://localhost:3000',
  
  // Para desenvolvimento com Expo (use o IP da sua máquina)
  EXPO: 'http://11.1.1.4:3000', // IP da sua máquina
  
  // Para produção
  PRODUCTION: 'https://sua-api.com',
};

// Função para obter a URL correta baseada no ambiente
export function getApiUrl() {
  // Se estiver usando Expo, detecta automaticamente
  if (Constants.expoConfig?.extra?.API_URL) {
    return Constants.expoConfig.extra.API_URL;
  }
  
  // Para desenvolvimento com Expo, use o IP da máquina
  if (__DEV__ && Constants.expoGoConfig) {
    return API_CONFIG.EXPO;
  }
  
  // Para desenvolvimento local
  if (__DEV__) {
    return API_CONFIG.LOCAL;
  }
  
  // Para produção
  return API_CONFIG.PRODUCTION;
}

// Função para testar conectividade
export async function testApiConnection() {
  try {
    const apiUrl = getApiUrl();
    console.log('🔍 Testando conexão com:', apiUrl);
    
    const response = await fetch(`${apiUrl}/`, {
      method: 'GET',
      timeout: 5000,
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API conectada:', data);
      return true;
    } else {
      console.log('❌ API respondeu com erro:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    return false;
  }
}
