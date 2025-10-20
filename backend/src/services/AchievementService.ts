import pool from '../db';
import { Achievement, AchievementResponse, UserStats } from '../models/Achievement';
import { NotificationService } from './NotificationService';

export class AchievementService {
  /**
   * Concede uma conquista para um usuário
   */
  async grantAchievement(userId: number, achievementTitle: string): Promise<boolean> {
    try {
      // Buscar a conquista pelo título
      const [achievementRows] = await pool.query(
        'SELECT * FROM achievements WHERE title = ?',
        [achievementTitle]
      );
      
      const achievements = achievementRows as Achievement[];
      if (achievements.length === 0) {
        console.log(`❌ Conquista "${achievementTitle}" não encontrada`);
        return false;
      }
      
      const achievement = achievements[0];
      if (!achievement) {
        console.log(`❌ Conquista "${achievementTitle}" não encontrada`);
        return false;
      }
      
      // Verificar se o usuário já tem essa conquista
      const [existingRows] = await pool.query(
        'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
        [userId, achievement.id]
      );
      
      if ((existingRows as any[]).length > 0) {
        console.log(`ℹ️ Usuário ${userId} já possui a conquista "${achievementTitle}"`);
        return false;
      }
      
      // Conceder a conquista
      await pool.query(
        'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
        [userId, achievement.id]
      );
      
      // Adicionar XP ao usuário
      await pool.query(
        `INSERT INTO user_xp (user_id, total_xp, level)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE 
           total_xp = total_xp + ?,
           level = FLOOR((total_xp + ?) / 1000) + 1,
           updated_at = CURRENT_TIMESTAMP`,
        [userId, achievement.xp_reward, achievement.xp_reward, achievement.xp_reward]
      );
      
      // Criar notificação
      const notificationService = new NotificationService();
      await notificationService.create(
        userId,
        'achievement_earned',
        `🎉 Conquista desbloqueada: ${achievement.title}`,
        `Você ganhou ${achievement.xp_reward} pontos! ${achievement.description}`
      );
      
      console.log(`✅ Conquista "${achievementTitle}" concedida ao usuário ${userId} (+${achievement.xp_reward} XP)`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao conceder conquista:', error);
      return false;
    }
  }

  /**
   * Busca todas as conquistas do usuário
   */
  async getUserAchievements(userId: number): Promise<AchievementResponse[]> {
    const [rows] = await pool.query(
      `SELECT a.*, ua.earned_at
       FROM achievements a
       INNER JOIN user_achievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = ?
       ORDER BY ua.earned_at DESC`,
      [userId]
    );

    return (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      type: row.type,
      xp_reward: row.xp_reward,
      earned_at: row.earned_at,
      is_earned: true
    }));
  }

  /**
   * Busca todas as conquistas disponíveis com status de progresso do usuário
   */
  async getAllAchievementsWithProgress(userId: number): Promise<AchievementResponse[]> {
    const [rows] = await pool.query(
      `SELECT a.*, ua.earned_at,
              CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as is_earned
       FROM achievements a
       LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
       ORDER BY a.type, a.requirement_value`,
      [userId]
    );

    return (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      type: row.type,
      xp_reward: row.xp_reward,
      earned_at: row.earned_at || undefined,
      is_earned: row.is_earned === 1
    }));
  }

  /**
   * Busca estatísticas do usuário (XP, level, conquistas)
   */
  async getUserStats(userId: number): Promise<UserStats> {
    // Buscar XP e level
    const [xpRows] = await pool.query(
      'SELECT total_xp, level FROM user_xp WHERE user_id = ?',
      [userId]
    );
    
    const xpData = (xpRows as any[])[0] || { total_xp: 0, level: 1 };
    
    // Contar conquistas
    const [achievementRows] = await pool.query(
      'SELECT COUNT(*) as count FROM user_achievements WHERE user_id = ?',
      [userId]
    );
    
    const achievementsCount = (achievementRows as any[])[0]?.count || 0;
    
    // Contar módulos completados
    const [moduleRows] = await pool.query(
      'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = "completed"',
      [userId]
    );
    
    const completedModules = (moduleRows as any[])[0]?.count || 0;
    
    // Contar trilhas completadas (todas os módulos de uma trilha completados)
    const [trailRows] = await pool.query(
      `SELECT COUNT(DISTINCT up.trail_id) as count
       FROM user_progress up
       INNER JOIN (
         SELECT trail_id, COUNT(*) as total_modules
         FROM modules
         GROUP BY trail_id
       ) m ON up.trail_id = m.trail_id
       WHERE up.user_id = ? AND up.status = 'completed'
       GROUP BY up.trail_id
       HAVING COUNT(*) = MAX(m.total_modules)`,
      [userId]
    );
    
    const completedTrails = (trailRows as any[])[0]?.count || 0;
    
    return {
      total_xp: xpData.total_xp,
      level: xpData.level,
      achievements_count: achievementsCount,
      completed_modules: completedModules,
      completed_trails: completedTrails
    };
  }

  /**
   * Deduz pontos de um usuário (para resgate de recompensas)
   */
  async deductPoints(userId: number, points: number): Promise<void> {
    // Verificar se o usuário tem pontos suficientes
    const userStats = await this.getUserStats(userId);
    
    if (userStats.total_xp < points) {
      throw new Error(`Pontos insuficientes. Disponível: ${userStats.total_xp}, Necessário: ${points}`);
    }
    
    // Deduzir pontos
    await pool.query(
      `UPDATE user_xp 
       SET total_xp = total_xp - ?
       WHERE user_id = ?`,
      [points, userId]
    );
    
    console.log(`✅ ${points} pontos deduzidos do usuário ${userId}`);
  }

  /**
   * Verifica e concede a conquista "Primeira Aprovação" se for a primeira submissão aprovada
   */
  async checkFirstApprovalAchievement(userId: number): Promise<void> {
    // Contar quantas submissões aprovadas o usuário tem
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM submissions WHERE user_id = ? AND status = "approved"',
      [userId]
    );
    
    const approvedCount = (rows as any[])[0]?.count || 0;
    
    // Se for a primeira aprovação, conceder a conquista
    if (approvedCount === 1) {
      await this.grantAchievement(userId, 'Primeira Aprovação');
    }
  }
}

