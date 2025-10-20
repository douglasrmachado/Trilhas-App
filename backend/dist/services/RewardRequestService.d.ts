import { RewardRequest, RewardRequestWithStudent } from '../models/RewardRequest';
export declare class RewardRequestService {
    private achievementService;
    constructor();
    createRequest(data: {
        studentId: number;
        rewardType: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
        message?: string;
    }): Promise<RewardRequest>;
    getStudentRequests(studentId: number): Promise<RewardRequest[]>;
    getPendingRequests(): Promise<RewardRequestWithStudent[]>;
    approveRequest(requestId: number, professorId: number, response?: string): Promise<void>;
    rejectRequest(requestId: number, professorId: number, response?: string): Promise<void>;
    getRequestById(requestId: number): Promise<RewardRequest | null>;
    getRewardTypes(): Array<{
        value: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
        label: string;
        description: string;
        pointsCost: number;
    }>;
}
//# sourceMappingURL=RewardRequestService.d.ts.map