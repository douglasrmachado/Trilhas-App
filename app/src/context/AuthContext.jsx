import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estado persistido na inicialização
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Debug: monitorar mudanças no estado
  useEffect(() => {
    console.log('🔄 AuthContext estado mudou:', { token: !!token, user });
  }, [token, user]);

  async function loadStoredAuth() {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        console.log('📱 Carregando dados persistidos:', { token: !!storedToken, user: JSON.parse(storedUser) });
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados persistidos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(authToken, authUser) {
    console.log('🔐 AuthContext login chamado:', { authToken: !!authToken, authUser });
    try {
      await AsyncStorage.setItem('auth_token', authToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
      setToken(authToken);
      setUser(authUser);
      console.log('✅ AuthContext estado atualizado e persistido');
    } catch (error) {
      console.error('❌ Erro ao persistir dados:', error);
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
      console.log('🚪 Logout realizado e dados removidos');
    } catch (error) {
      console.error('❌ Erro ao remover dados:', error);
    }
  }

  const value = useMemo(() => ({ token, user, login, logout, isLoading }), [token, user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


