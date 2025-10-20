export interface RewardRequestRow {
    id: number;
    student_id: number;
    reward_type: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
    points_cost: number;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    professor_id: number | null;
    professor_response: string | null;
    created_at: string;
    updated_at: string;
}
export interface RewardRequestWithStudent extends RewardRequestRow {
    student_name: string;
    student_email: string;
    professor_name?: string;
}
export declare class RewardRequest {
    id: number;
    studentId: number;
    rewardType: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
    pointsCost: number;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    professorId: number | null;
    professorResponse: string | null;
    createdAt: string;
    updatedAt: string;
    constructor(row: RewardRequestRow);
    static create(data: {
        studentId: number;
        rewardType: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
        message?: string;
    }): Promise<RewardRequest>;
    static findById(id: number): Promise<RewardRequest | null>;
    static findByStudentId(studentId: number): Promise<RewardRequest[]>;
    static findPendingForProfessors(): Promise<RewardRequestWithStudent[]>;
    updateStatus(status: 'approved' | 'rejected', professorId: number, response?: string): Promise<void>;
    getRewardTypeLabel(): string;
    getStatusLabel(): string;
}
//# sourceMappingURL=RewardRequest.d.ts.map