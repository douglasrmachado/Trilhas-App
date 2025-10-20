import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';

const TrailContext = createContext(null);

export function TrailProvider({ children }) {
  const { token } = useAuth();
  const [trails, setTrails] = useState([]);
  const [userStats, setUserStats] = useState({
    total_xp: 0,
    level: 1,
    streak_days: 0,
    completed_modules: 0,
    completed_trails: 0,
    achievements_count: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

  // Buscar trilhas
  const fetchTrails = useCallback(async () => {
    if (!token) {
      console.log('⚠️ TrailContext: Sem token, não buscando trilhas');
      return;
    }
    
    try {
      console.log('🔄 TrailContext: Buscando trilhas...');
      setLoading(true);
      const response = await axios.get(`${apiUrl}/trails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 TrailContext: Resposta recebida:', response.data);
      
      if (response.data.success) {
        console.log('✅ TrailContext: Trilhas carregadas:', response.data.trails?.length || 0);
        setTrails(response.data.trails || []);
      }
    } catch (error) {
      console.error('❌ TrailContext: Erro ao buscar trilhas:', error);
      setTrails([]);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  // Buscar estatísticas do usuário
  const fetchUserStats = useCallback(async () => {
    if (!token) return;
    
    try {
      // Buscar stats de conquistas (XP, level, etc)
      const response = await axios.get(`${apiUrl}/achievements/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserStats(response.data);
    } catch (error) {
      console.error('❌ Erro ao buscar stats:', error);
    }
  }, [token, apiUrl]);

  // Buscar conquistas
  const fetchAchievements = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${apiUrl}/achievements/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAchievements(response.data);
    } catch (error) {
      console.error('❌ Erro ao buscar conquistas:', error);
    }
  }, [token, apiUrl]);

  // Buscar módulos de uma trilha
  const fetchTrailModules = useCallback(async (trailId) => {
    if (!token) return null;
    
    try {
      const response = await axios.get(`${apiUrl}/trails/${trailId}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        return response.data.modules;
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar módulos:', error);
      return null;
    }
  }, [token, apiUrl]);

  // Atualizar progresso de um módulo
  const updateModuleProgress = useCallback(async (moduleId, status) => {
    if (!token) return false;
    
    try {
      const response = await axios.put(
        `${apiUrl}/trails/modules/${moduleId}/progress`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Atualizar dados locais
        await Promise.all([
          fetchTrails(),
          fetchUserStats(),
          fetchAchievements()
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao atualizar progresso:', error);
      return false;
    }
  }, [token, apiUrl, fetchTrails, fetchUserStats, fetchAchievements]);

  // Carregar dados iniciais quando o token mudar
  useEffect(() => {
    if (token) {
      fetchTrails();
      fetchUserStats();
      fetchAchievements();
    }
  }, [token, fetchTrails, fetchUserStats, fetchAchievements]);

  const value = {
    trails,
    userStats,
    achievements,
    loading,
    fetchTrails,
    fetchUserStats,
    fetchAchievements,
    fetchTrailModules,
    updateModuleProgress
  };

  return <TrailContext.Provider value={value}>{children}</TrailContext.Provider>;
}

export function useTrails() {
  const context = useContext(TrailContext);
  if (!context) {
    throw new Error('useTrails must be used within TrailProvider');
  }
  return context;
}

