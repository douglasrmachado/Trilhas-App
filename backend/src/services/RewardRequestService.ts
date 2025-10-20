import { RewardRequest, RewardRequestWithStudent } from '../models/RewardRequest';
import { AchievementService } from './AchievementService';

export class RewardRequestService {
  private achievementService: AchievementService;

  constructor() {
    this.achievementService = new AchievementService();
  }

  async createRequest(data: {
    studentId: number;
    rewardType: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
    message?: string;
  }): Promise<RewardRequest> {
    // Verificar se o aluno tem pontos suficientes
    const userStats = await this.achievementService.getUserStats(data.studentId);
    const requiredPoints = 100;
    
    if (userStats.total_xp < requiredPoints) {
      throw new Error(`Pontos insuficientes. Necessário: ${requiredPoints}, Disponível: ${userStats.total_xp}`);
    }

    // Criar a solicitação
    const request = await RewardRequest.create(data);
    
    return request;
  }

  async getStudentRequests(studentId: number): Promise<RewardRequest[]> {
    return await RewardRequest.findByStudentId(studentId);
  }

  async getPendingRequests(): Promise<RewardRequestWithStudent[]> {
    return await RewardRequest.findPendingForProfessors();
  }

  async approveRequest(
    requestId: number,
    professorId: number,
    response?: string
  ): Promise<void> {
    const request = await RewardRequest.findById(requestId);
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
    const { NotificationService } = await import('./NotificationService');
    const notificationService = new NotificationService();
    
    await notificationService.create(
      request.studentId,
      'reward_approved',
      'Recompensa Aprovada!',
      `Sua solicitação de ${request.getRewardTypeLabel()} foi aprovada. ${response || ''}`
    );
  }

  async rejectRequest(
    requestId: number,
    professorId: number,
    response?: string
  ): Promise<void> {
    const request = await RewardRequest.findById(requestId);
    if (!request) {
      throw new Error('Solicitação não encontrada');
    }

    if (request.status !== 'pending') {
      throw new Error('Solicitação já foi processada');
    }

    // Rejeitar a solicitação
    await request.updateStatus('rejected', professorId, response);

    // Criar notificação para o aluno
    const { NotificationService } = await import('./NotificationService');
    const notificationService = new NotificationService();
    
    await notificationService.create(
      request.studentId,
      'reward_rejected',
      'Recompensa Rejeitada',
      `Sua solicitação de ${request.getRewardTypeLabel()} foi rejeitada. ${response || ''}`
    );
  }

  async getRequestById(requestId: number): Promise<RewardRequest | null> {
    return await RewardRequest.findById(requestId);
  }

  getRewardTypes(): Array<{
    value: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
    label: string;
    description: string;
    pointsCost: number;
  }> {
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
