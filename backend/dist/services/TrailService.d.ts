import { TrailWithProgress, ModuleWithProgress, UserStats, Achievement } from '../models/Trail';
export declare class TrailService {
    /**
     * Busca todas as trilhas com progresso do usuário
     */
    getTrailsWithProgress(userId: number): Promise<TrailWithProgress[]>;
    /**
     * Busca módulos de uma trilha com progresso
     */
    getTrailModules(trailId: number, userId: number): Promise<ModuleWithProgress[]>;
    /**
     * Inicia ou atualiza progresso de um módulo
     */
    updateModuleProgress(userId: number, moduleId: number, status: 'in_progress' | 'completed'): Promise<void>;
    /**
     * Atualiza XP total do usuário
     */
    private updateUserXP;
    /**
     * Busca estatísticas do usuário
     */
    getUserStats(userId: number): Promise<UserStats>;
    /**
     * Verifica e desbloqueia conquistas
     */
    private checkAchievements;
    /**
     * Busca conquistas do usuário
     */
    getUserAchievements(userId: number): Promise<Achievement[]>;
    /**
     * Busca conteúdos aprovados de um módulo específico
     */
    getModuleContents(moduleId: number): Promise<any[]>;
}
//# sourceMappingURL=TrailService.d.ts.map