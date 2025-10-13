export interface Trail {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  total_xp: number;
  course: 'base' | 'Informática' | 'Meio Ambiente' | 'Produção Cultural' | 'Mecânica';
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Module {
  id?: number;
  trail_id: number;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  resources_count: number;
  badge?: string;
  content?: string;
  is_locked: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserProgress {
  id?: number;
  user_id: number;
  module_id: number;
  trail_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  xp_earned: number;
  completed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Achievement {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  type: 'module' | 'trail' | 'streak' | 'special';
  requirement_value: number;
  xp_reward: number;
  created_at?: Date;
}

export interface UserAchievement {
  id?: number;
  user_id: number;
  achievement_id: number;
  earned_at?: Date;
}

export interface UserXP {
  id?: number;
  user_id: number;
  total_xp: number;
  level: number;
  streak_days: number;
  last_activity_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// DTOs para respostas da API

export interface TrailWithProgress {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: string;
  total_xp: number;
  progress: number; // 0-100
  completed_modules: number;
  total_modules: number;
  is_completed: boolean;
}

export interface ModuleWithProgress {
  id: number;
  trail_id: number;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  resources_count: number;
  badge: string;
  status: 'not_started' | 'in_progress' | 'completed';
  is_locked: boolean;
  xp_earned: number;
}

export interface UserStats {
  total_xp: number;
  level: number;
  streak_days: number;
  completed_modules: number;
  completed_trails: number;
  achievements_count: number;
  rank?: string;
}

