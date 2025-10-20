"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RewardRequestService_1 = require("../services/RewardRequestService");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
const service = new RewardRequestService_1.RewardRequestService();
/**
 * GET /reward-requests/types
 * Lista os tipos de recompensas disponíveis
 */
router.get('/types', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const types = service.getRewardTypes();
    res.json({ success: true, types });
}));
/**
 * POST /reward-requests
 * Cria uma nova solicitação de recompensa (apenas estudantes)
 */
router.post('/', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
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
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}));
/**
 * GET /reward-requests/my
 * Lista as solicitações do usuário logado (apenas estudantes)
 */
router.get('/my', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
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
router.get('/pending', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userRole = req.user.role;
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
router.patch('/:id/approve', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const professorId = req.user.id;
    const userRole = req.user.role;
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
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}));
/**
 * PATCH /reward-requests/:id/reject
 * Rejeita uma solicitação (apenas professores)
 */
router.patch('/:id/reject', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const professorId = req.user.id;
    const userRole = req.user.role;
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
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}));
/**
 * GET /reward-requests/:id
 * Busca uma solicitação específica
 */
router.get('/:id', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
exports.default = router;
//# sourceMappingURL=rewardRequests.js.map