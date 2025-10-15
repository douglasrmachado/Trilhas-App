import { Router, Request, Response } from 'express';
import { TrailService } from '../services/TrailService';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/errorHandler';

const router = Router();
const trailService = new TrailService();

/**
 * @route   GET /trails
 * @desc    Busca todas as trilhas com progresso do usuário
 * @access  Private
 */
router.get('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  console.log('📚 Buscando trilhas para usuário:', userId);
  
  const trails = await trailService.getTrailsWithProgress(userId);
  
  res.json({
    success: true,
    trails
  });
}));

/**
 * @route   GET /trails/:trailId/modules
 * @desc    Busca módulos de uma trilha com progresso
 * @access  Private
 */
router.get('/:trailId/modules', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const trailId = parseInt(req.params.trailId || '0');
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  if (isNaN(trailId)) {
    return res.status(400).json({
      success: false,
      message: 'ID da trilha inválido'
    });
  }

  console.log('📖 Buscando módulos da trilha:', trailId, 'para usuário:', userId);
  
  const modules = await trailService.getTrailModules(trailId, userId);
  
  res.json({
    success: true,
    modules
  });
}));

/**
 * @route   PUT /trails/modules/:moduleId/progress
 * @desc    Atualiza progresso de um módulo
 * @access  Private
 */
router.put('/modules/:moduleId/progress', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const moduleId = parseInt(req.params.moduleId || '0');
  const { status } = req.body;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  if (isNaN(moduleId)) {
    return res.status(400).json({
      success: false,
      message: 'ID do módulo inválido'
    });
  }

  if (!status || !['in_progress', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status inválido. Use "in_progress" ou "completed"'
    });
  }

  console.log('✏️ Atualizando progresso do módulo:', moduleId, 'para:', status);
  
  await trailService.updateModuleProgress(userId, moduleId, status);
  
  res.json({
    success: true,
    message: 'Progresso atualizado com sucesso'
  });
}));

/**
 * @route   GET /trails/stats
 * @desc    Busca estatísticas do usuário
 * @access  Private
 */
router.get('/stats', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  console.log('📊 Buscando estatísticas do usuário:', userId);
  
  const stats = await trailService.getUserStats(userId);
  
  res.json({
    success: true,
    stats
  });
}));

/**
 * @route   GET /trails/achievements
 * @desc    Busca conquistas do usuário
 * @access  Private
 */
router.get('/achievements', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  console.log('🏆 Buscando conquistas do usuário:', userId);
  
  const achievements = await trailService.getUserAchievements(userId);
  
  res.json({
    success: true,
    achievements
  });
}));

/**
 * @route   GET /trails/modules/:moduleId/contents
 * @desc    Busca conteúdos aprovados de um módulo
 * @access  Private
 */
router.get('/modules/:moduleId/contents', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const moduleId = parseInt(req.params.moduleId || '0');
  
  if (isNaN(moduleId)) {
    return res.status(400).json({
      success: false,
      message: 'ID do módulo inválido'
    });
  }

  console.log('📚 Buscando conteúdos do módulo:', moduleId);
  
  const contents = await trailService.getModuleContents(moduleId);
  
  res.json({
    success: true,
    contents
  });
}));

export default router;

