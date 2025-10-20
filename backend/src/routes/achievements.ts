import { Router, Request, Response } from 'express';
import { AchievementService } from '../services/AchievementService';
import { requireAuth } from '../middleware/auth';

const router = Router();
const achievementService = new AchievementService();

/**
 * GET /achievements/my
 * Busca todas as conquistas do usuário logado
 */
router.get('/my', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const achievements = await achievementService.getUserAchievements(userId);
    res.json(achievements);
  } catch (error) {
    console.error('Erro ao buscar conquistas do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar conquistas' });
  }
});

/**
 * GET /achievements/all
 * Busca todas as conquistas disponíveis com progresso do usuário
 */
router.get('/all', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const achievements = await achievementService.getAllAchievementsWithProgress(userId);
    res.json(achievements);
  } catch (error) {
    console.error('Erro ao buscar todas as conquistas:', error);
    res.status(500).json({ message: 'Erro ao buscar conquistas' });
  }
});

/**
 * GET /achievements/stats
 * Busca estatísticas do usuário (XP, level, conquistas)
 */
router.get('/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const stats = await achievementService.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

export default router;

