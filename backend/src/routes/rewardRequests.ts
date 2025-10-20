import { Router, Request, Response } from 'express';
import { RewardRequestService } from '../services/RewardRequestService';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/errorHandler';

const router = Router();
const service = new RewardRequestService();

/**
 * GET /reward-requests/types
 * Lista os tipos de recompensas disponíveis
 */
router.get('/types', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const types = service.getRewardTypes();
  res.json({ success: true, types });
}));

/**
 * POST /reward-requests
 * Cria uma nova solicitação de recompensa (apenas estudantes)
 */
router.post('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userRole = (req as any).user.role;
  
  if (userRole !== 'student') {
    return res.status(403).json({ success: false, message: 'Apenas estudantes podem solicitar recompensas' });
  }

  const { rewardType, message } = req.body;
  
  if (!rewardType || !['horas_afins', 'recuperacao_extra', 'pontos_extra'].includes(rewardType)) {
    return res.status(400).json({ success: false, message: 'Tipo de recompensa inválido' });
  }

  try {
    const request = await service.createRequest({
      studentId: userId,
      rewardType,
      message
    });

    res.status(201).json({ success: true, request });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
}));

/**
 * GET /reward-requests/my
 * Lista as solicitações do usuário logado (apenas estudantes)
 */
router.get('/my', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userRole = (req as any).user.role;
  
  if (userRole !== 'student') {
    return res.status(403).json({ success: false, message: 'Apenas estudantes podem visualizar suas solicitações' });
  }

  const requests = await service.getStudentRequests(userId);
  res.json({ success: true, requests });
}));

/**
 * GET /reward-requests/pending
 * Lista solicitações pendentes (apenas professores)
 */
router.get('/pending', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userRole = (req as any).user.role;
  
  if (userRole !== 'professor') {
    return res.status(403).json({ success: false, message: 'Apenas professores podem visualizar solicitações pendentes' });
  }

  const requests = await service.getPendingRequests();
  res.json({ success: true, requests });
}));

/**
 * PATCH /reward-requests/:id/approve
 * Aprova uma solicitação (apenas professores)
 */
router.patch('/:id/approve', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const professorId = (req as any).user.id;
  const userRole = (req as any).user.role;
  const requestId = Number(req.params.id);
  
  if (userRole !== 'professor') {
    return res.status(403).json({ success: false, message: 'Apenas professores podem aprovar solicitações' });
  }

  if (!requestId || isNaN(requestId)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  const { response } = req.body;

  try {
    await service.approveRequest(requestId, professorId, response);
    res.json({ success: true, message: 'Solicitação aprovada com sucesso' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
}));

/**
 * PATCH /reward-requests/:id/reject
 * Rejeita uma solicitação (apenas professores)
 */
router.patch('/:id/reject', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const professorId = (req as any).user.id;
  const userRole = (req as any).user.role;
  const requestId = Number(req.params.id);
  
  if (userRole !== 'professor') {
    return res.status(403).json({ success: false, message: 'Apenas professores podem rejeitar solicitações' });
  }

  if (!requestId || isNaN(requestId)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  const { response } = req.body;

  try {
    await service.rejectRequest(requestId, professorId, response);
    res.json({ success: true, message: 'Solicitação rejeitada' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
}));

/**
 * GET /reward-requests/:id
 * Busca uma solicitação específica
 */
router.get('/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  
  if (!requestId || isNaN(requestId)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  const request = await service.getRequestById(requestId);
  
  if (!request) {
    return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
  }

  res.json({ success: true, request });
}));

export default router;
