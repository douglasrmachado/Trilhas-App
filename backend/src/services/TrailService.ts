import pool from '../db';
import { 
  Trail, 
  Module, 
  UserProgress, 
  UserXP,
  TrailWithProgress, 
  ModuleWithProgress,
  UserStats,
  Achievement,
  UserAchievement
} from '../models/Trail';

export class TrailService {
  /**
   * Busca todas as trilhas com progresso do usuário
   */
  async getTrailsWithProgress(userId: number): Promise<TrailWithProgress[]> {
    // Buscar curso do usuário
    const [userRows] = await pool.query(
      'SELECT course FROM users WHERE id = ?',
      [userId]
    );
    
    const userCourse = Array.isArray(userRows) && userRows.length > 0 
      ? (userRows[0] as any).course 
      : null;

    console.log('🎓 Curso do usuário:', userCourse);
    console.log('👤 User ID:', userId);

    // Buscar trilhas base + trilhas do curso específico do usuário
    const [rows] = await pool.query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.icon,
        t.category,
        t.difficulty,
        t.total_xp,
        COUNT(DISTINCT m.id) as total_modules,
        COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.module_id END) as completed_modules,
        COALESCE(
          ROUND(
            (COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.module_id END) / COUNT(DISTINCT m.id)) * 100
          ), 0
        ) as progress
      FROM trails t
      LEFT JOIN modules m ON m.trail_id = t.id
      LEFT JOIN user_progress up ON up.module_id = m.id AND up.user_id = ?
      WHERE t.is_active = TRUE 
        AND (t.course = 'base' OR t.course = ?)
      GROUP BY t.id
      ORDER BY 
        CASE WHEN t.course = 'base' THEN 1 ELSE 2 END,
        t.id
    `, [userId, userCourse]);

    console.log(`📊 Total de trilhas encontradas: ${(rows as any[]).length}`);
    console.log('📋 Trilhas:', (rows as any[]).map((r: any) => r.title));

    return (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      category: row.category,
      difficulty: row.difficulty,
      total_xp: row.total_xp,
      progress: Number(row.progress),
      completed_modules: Number(row.completed_modules),
      total_modules: Number(row.total_modules),
      // Compatibilidade com frontend
      completed: Number(row.completed_modules),
      total: Number(row.total_modules),
      is_completed: Number(row.completed_modules) === Number(row.total_modules) && Number(row.total_modules) > 0
    }));
  }

  /**
   * Busca módulos de uma trilha com progresso
   */
  async getTrailModules(trailId: number, userId: number): Promise<ModuleWithProgress[]> {
    const [rows] = await pool.query(`
      SELECT 
        m.id,
        m.trail_id,
        m.title,
        m.description,
        m.order_index,
        m.xp_reward,
        COUNT(DISTINCT s.id) as resources_count,
        m.badge,
        m.is_locked,
        COALESCE(up.status, 'not_started') as status,
        COALESCE(up.xp_earned, 0) as xp_earned
      FROM modules m
      LEFT JOIN user_progress up ON up.module_id = m.id AND up.user_id = ?
      LEFT JOIN submissions s ON s.module_id = m.id AND s.status = 'approved'
      WHERE m.trail_id = ?
      GROUP BY m.id, m.trail_id, m.title, m.description, m.order_index, m.xp_reward, m.badge, m.is_locked, up.status, up.xp_earned
      ORDER BY m.order_index
    `, [userId, trailId]);

    const modules = rows as any[];
    
    // Lógica de desbloqueio: apenas o primeiro módulo ou módulos após completados ficam disponíveis
    return modules.map((module, index) => {
      const isFirstModule = index === 0;
      const previousModuleCompleted = index > 0 ? modules[index - 1].status === 'completed' : true;
      const isLocked = !isFirstModule && !previousModuleCompleted;

      return {
        id: module.id,
        trail_id: module.trail_id,
        title: module.title,
        description: module.description,
        order_index: module.order_index,
        xp_reward: module.xp_reward,
        resources_count: module.resources_count,
        badge: module.badge || '🏅',
        status: module.status,
        is_locked: isLocked,
        xp_earned: Number(module.xp_earned)
      };
    });
  }

  /**
   * Inicia ou atualiza progresso de um módulo
   */
  async updateModuleProgress(
    userId: number, 
    moduleId: number, 
    status: 'in_progress' | 'completed'
  ): Promise<void> {
    // Buscar informações do módulo
    const [moduleRows] = await pool.query(
      'SELECT trail_id, xp_reward FROM modules WHERE id = ?',
      [moduleId]
    );
    
    if (!Array.isArray(moduleRows) || moduleRows.length === 0) {
      throw new Error('Módulo não encontrado');
    }

    const module = moduleRows[0] as any;
    const xpEarned = status === 'completed' ? module.xp_reward : 0;

    // Verificar se já existe progresso
    const [existingRows] = await pool.query(
      'SELECT id, status FROM user_progress WHERE user_id = ? AND module_id = ?',
      [userId, moduleId]
    );

    const existing = Array.isArray(existingRows) && existingRows.length > 0 ? existingRows[0] as any : null;

    if (existing) {
      // Atualizar progresso existente
      await pool.query(
        `UPDATE user_progress 
         SET status = ?, xp_earned = ?, completed_at = ?, updated_at = NOW()
         WHERE id = ?`,
        [status, xpEarned, status === 'completed' ? new Date() : null, existing.id]
      );

      // Se estava completo e agora não está mais, remover XP
      if (existing.status === 'completed' && status !== 'completed') {
        await this.updateUserXP(userId, -module.xp_reward);
      }
      // Se não estava completo e agora está, adicionar XP
      else if (existing.status !== 'completed' && status === 'completed') {
        await this.updateUserXP(userId, module.xp_reward);
        await this.checkAchievements(userId);
      }
    } else {
      // Criar novo progresso
      await pool.query(
        `INSERT INTO user_progress (user_id, module_id, trail_id, status, xp_earned, completed_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, moduleId, module.trail_id, status, xpEarned, status === 'completed' ? new Date() : null]
      );

      if (status === 'completed') {
        await this.updateUserXP(userId, module.xp_reward);
        await this.checkAchievements(userId);
      }
    }
  }

  /**
   * Atualiza XP total do usuário
   */
  private async updateUserXP(userId: number, xpChange: number): Promise<void> {
    // Verificar se existe registro de XP
    const [existingRows] = await pool.query(
      'SELECT id, total_xp FROM user_xp WHERE user_id = ?',
      [userId]
    );

    const existing = Array.isArray(existingRows) && existingRows.length > 0 ? existingRows[0] as any : null;

    if (existing) {
      const newTotalXP = Math.max(0, existing.total_xp + xpChange);
      const newLevel = Math.floor(newTotalXP / 100) + 1; // 100 XP por nível

      await pool.query(
        'UPDATE user_xp SET total_xp = ?, level = ?, last_activity_date = CURDATE(), updated_at = NOW() WHERE id = ?',
        [newTotalXP, newLevel, existing.id]
      );
    } else {
      // Criar registro inicial
      const totalXP = Math.max(0, xpChange);
      const level = Math.floor(totalXP / 100) + 1;

      await pool.query(
        'INSERT INTO user_xp (user_id, total_xp, level, last_activity_date) VALUES (?, ?, ?, CURDATE())',
        [userId, totalXP, level]
      );
    }
  }

  /**
   * Busca estatísticas do usuário
   */
  async getUserStats(userId: number): Promise<UserStats> {
    // Buscar XP e level
    const [xpRows] = await pool.query(
      'SELECT total_xp, level, streak_days FROM user_xp WHERE user_id = ?',
      [userId]
    );

    const xpData = Array.isArray(xpRows) && xpRows.length > 0 ? xpRows[0] as any : null;

    // Contar módulos completados
    const [moduleRows] = await pool.query(
      'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = "completed"',
      [userId]
    );

    const completedModules = Array.isArray(moduleRows) && moduleRows.length > 0 
      ? (moduleRows[0] as any).count 
      : 0;

    // Contar trilhas completadas
    const [trailRows] = await pool.query(`
      SELECT COUNT(DISTINCT t.id) as count
      FROM trails t
      INNER JOIN modules m ON m.trail_id = t.id
      LEFT JOIN user_progress up ON up.module_id = m.id AND up.user_id = ? AND up.status = 'completed'
      GROUP BY t.id
      HAVING COUNT(DISTINCT m.id) = COUNT(DISTINCT up.module_id)
    `, [userId]);

    const completedTrails = Array.isArray(trailRows) ? trailRows.length : 0;

    // Contar conquistas
    const [achievementRows] = await pool.query(
      'SELECT COUNT(*) as count FROM user_achievements WHERE user_id = ?',
      [userId]
    );

    const achievementsCount = Array.isArray(achievementRows) && achievementRows.length > 0
      ? (achievementRows[0] as any).count
      : 0;

    return {
      total_xp: xpData?.total_xp || 0,
      level: xpData?.level || 1,
      streak_days: xpData?.streak_days || 0,
      completed_modules: Number(completedModules),
      completed_trails: Number(completedTrails),
      achievements_count: Number(achievementsCount)
    };
  }

  /**
   * Verifica e desbloqueia conquistas
   */
  private async checkAchievements(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);

    // Buscar conquistas disponíveis
    const [achievements] = await pool.query(`
      SELECT a.* 
      FROM achievements a
      LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
      WHERE ua.id IS NULL
    `, [userId]);

    for (const achievement of achievements as any[]) {
      let shouldUnlock = false;

      switch (achievement.type) {
        case 'module':
          shouldUnlock = stats.completed_modules >= achievement.requirement_value;
          break;
        case 'trail':
          shouldUnlock = stats.completed_trails >= achievement.requirement_value;
          break;
        case 'streak':
          shouldUnlock = stats.streak_days >= achievement.requirement_value;
          break;
      }

      if (shouldUnlock) {
        await pool.query(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
          [userId, achievement.id]
        );
        
        // Adicionar XP da conquista
        await this.updateUserXP(userId, achievement.xp_reward);
      }
    }
  }

  /**
   * Busca conquistas do usuário
   */
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const [rows] = await pool.query(`
      SELECT a.*, ua.earned_at
      FROM achievements a
      INNER JOIN user_achievements ua ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
      ORDER BY ua.earned_at DESC
    `, [userId]);

    return rows as Achievement[];
  }

  /**
   * Busca conteúdos aprovados de um módulo específico
   */
  async getModuleContents(moduleId: number): Promise<any[]> {
    const [rows] = await pool.query(`
      SELECT 
        s.id,
        s.title,
        s.description,
        s.content_type,
        s.file_path,
        s.file_name,
        s.file_size,
        s.keywords,
        s.created_at,
        u.name as author_name
      FROM submissions s
      INNER JOIN users u ON u.id = s.user_id
      WHERE s.module_id = ? AND s.status = 'approved'
      ORDER BY s.created_at DESC
    `, [moduleId]);

    return rows as any[];
  }
}

