import { AchievementResponse, UserStats } from '../models/Achievement';
export declare class AchievementService {
    /**
     * Concede uma conquista para um usuário
     */
    grantAchievement(userId: number, achievementTitle: string): Promise<boolean>;
    /**
     * Busca todas as conquistas do usuário
     */
    getUserAchievements(userId: number): Promise<AchievementResponse[]>;
    /**
     * Busca todas as conquistas disponíveis com status de progresso do usuário
     */
    getAllAchievementsWithProgress(userId: number): Promise<AchievementResponse[]>;
    /**
     * Busca estatísticas do usuário (XP, level, conquistas)
     */
    getUserStats(userId: number): Promise<UserStats>;
    /**
     * Deduz pontos de um usuário (para resgate de recompensas)
     */
    deductPoints(userId: number, points: number): Promise<void>;
    /**
     * Verifica e concede a conquista "Primeira Aprovação" se for a primeira submissão aprovada
     */
    checkFirstApprovalAchievement(userId: number): Promise<void>;
}
//# sourceMappingURL=AchievementService.d.ts.map