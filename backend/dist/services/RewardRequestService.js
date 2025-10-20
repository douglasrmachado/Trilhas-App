"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardRequestService = void 0;
const RewardRequest_1 = require("../models/RewardRequest");
const AchievementService_1 = require("./AchievementService");
class RewardRequestService {
    constructor() {
        this.achievementService = new AchievementService_1.AchievementService();
    }
    async createRequest(data) {
        // Verificar se o aluno tem pontos suficientes
        const userStats = await this.achievementService.getUserStats(data.studentId);
        const requiredPoints = 100;
        if (userStats.total_xp < requiredPoints) {
            throw new Error(`Pontos insuficientes. Necessário: ${requiredPoints}, Disponível: ${userStats.total_xp}`);
        }
        // Criar a solicitação
        const request = await RewardRequest_1.RewardRequest.create(data);
        return request;
    }
    async getStudentRequests(studentId) {
        return await RewardRequest_1.RewardRequest.findByStudentId(studentId);
    }
    async getPendingRequests() {
        return await RewardRequest_1.RewardRequest.findPendingForProfessors();
    }
    async approveRequest(requestId, professorId, response) {
        const request = await RewardRequest_1.RewardRequest.findById(requestId);
        if (!request) {
            throw new Error('Solicitação não encontrada');
        }
        if (request.status !== 'pending') {
            throw new Error('Solicitação já foi processada');
        }
        // Verificar novamente se o aluno tem pontos suficientes
        const userStats = await this.achievementService.getUserStats(request.studentId);
        if (userStats.total_xp < request.pointsCost) {
            throw new Error('Aluno não possui pontos suficientes');
        }
        // Aprovar a solicitação
        await request.updateStatus('approved', professorId, response);
        // Deduzir pontos do aluno
        await this.achievementService.deductPoints(request.studentId, request.pointsCost);
        // Criar notificação para o aluno
        const { NotificationService } = await Promise.resolve().then(() => __importStar(require('./NotificationService')));
        const notificationService = new NotificationService();
        await notificationService.create(request.studentId, 'reward_approved', 'Recompensa Aprovada!', `Sua solicitação de ${request.getRewardTypeLabel()} foi aprovada. ${response || ''}`);
    }
    async rejectRequest(requestId, professorId, response) {
        const request = await RewardRequest_1.RewardRequest.findById(requestId);
        if (!request) {
            throw new Error('Solicitação não encontrada');
        }
        if (request.status !== 'pending') {
            throw new Error('Solicitação já foi processada');
        }
        // Rejeitar a solicitação
        await request.updateStatus('rejected', professorId, response);
        // Criar notificação para o aluno
        const { NotificationService } = await Promise.resolve().then(() => __importStar(require('./NotificationService')));
        const notificationService = new NotificationService();
        await notificationService.create(request.studentId, 'reward_rejected', 'Recompensa Rejeitada', `Sua solicitação de ${request.getRewardTypeLabel()} foi rejeitada. ${response || ''}`);
    }
    async getRequestById(requestId) {
        return await RewardRequest_1.RewardRequest.findById(requestId);
    }
    getRewardTypes() {
        return [
            {
                value: 'horas_afins',
                label: 'Horas Afins',
                description: 'Horas complementares para atividades extracurriculares',
                pointsCost: 100
            },
            {
                value: 'recuperacao_extra',
                label: 'Recuperação Extra',
                description: 'Oportunidade adicional de recuperação em disciplinas',
                pointsCost: 100
            },
            {
                value: 'pontos_extra',
                label: 'Pontos Extra',
                description: 'Pontos adicionais em atividades ou provas',
                pointsCost: 100
            }
        ];
    }
}
exports.RewardRequestService = RewardRequestService;
//# sourceMappingURL=RewardRequestService.js.map