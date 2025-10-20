"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const NotificationService_1 = require("../services/NotificationService");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
const service = new NotificationService_1.NotificationService();
router.get('/', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.get('/count', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autenticado' });
    }
    const count = await service.countUnread(userId);
    res.json({ success: true, count });
}));
router.post('/mark-all-read', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autenticado' });
    }
    await service.markAllRead(userId);
    res.json({ success: true });
}));
router.patch('/mark-read/:id', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.delete('/delete-all', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autenticado' });
    }
    await service.deleteAll(userId);
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=notifications.js.map