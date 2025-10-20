"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AchievementService_1 = require("../services/AchievementService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const achievementService = new AchievementService_1.AchievementService();
/**
 * GET /achievements/my
 * Busca todas as conquistas do usuário logado
 */
router.get('/my', auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const achievements = await achievementService.getUserAchievements(userId);
        res.json(achievements);
    }
    catch (error) {
        console.error('Erro ao buscar conquistas do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar conquistas' });
    }
});
/**
 * GET /achievements/all
 * Busca todas as conquistas disponíveis com progresso do usuário
 */
router.get('/all', auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const achievements = await achievementService.getAllAchievementsWithProgress(userId);
        res.json(achievements);
    }
    catch (error) {
        console.error('Erro ao buscar todas as conquistas:', error);
        res.status(500).json({ message: 'Erro ao buscar conquistas' });
    }
});
/**
 * GET /achievements/stats
 * Busca estatísticas do usuário (XP, level, conquistas)
 */
router.get('/stats', auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await achievementService.getUserStats(userId);
        res.json(stats);
    }
    catch (error) {
        console.error('Erro ao buscar estatísticas do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
});
exports.default = router;
//# sourceMappingURL=achievements.js.map