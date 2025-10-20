export interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    type: 'module' | 'trail' | 'streak' | 'special';
    requirement_value: number;
    xp_reward: number;
    created_at?: Date;
}
export interface UserAchievement {
    id: number;
    user_id: number;
    achievement_id: number;
    earned_at: Date;
}
export interface AchievementResponse {
    id: number;
    title: string;
    description: string;
    icon: string;
    type: string;
    xp_reward: number;
    earned_at?: Date;
    is_earned?: boolean;
}
export interface UserStats {
    total_xp: number;
    level: number;
    achievements_count: number;
    completed_modules: number;
    completed_trails: number;
}
//# sourceMappingURL=Achievement.d.ts.map