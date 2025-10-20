import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { NotificationService } from '../services/NotificationService';
import { asyncHandler } from '../utils/errorHandler';

const router = Router();
const service = new NotificationService();

router.get('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  const onlyUnread = req.query.onlyUnread === 'true';
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const offset = Number(req.query.offset || 0);
  const items = await service.list(userId, onlyUnread, limit, offset);
  res.json({ success: true, items });
}));

router.get('/count', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  const count = await service.countUnread(userId);
  res.json({ success: true, count });
}));

router.post('/mark-all-read', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  await service.markAllRead(userId);
  res.json({ success: true });
}));

router.patch('/mark-read/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const notificationId = Number(req.params.id);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  if (!notificationId || isNaN(notificationId)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }
  await service.markRead(notificationId, userId);
  res.json({ success: true });
}));

router.delete('/delete-all', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  await service.deleteAll(userId);
  res.json({ success: true });
}));

export default router;






