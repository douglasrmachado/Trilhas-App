import { Submission, CreateSubmissionRequest, SubmissionResponse } from '../models/Submission';
export declare class SubmissionService {
    /**
     * Cria uma nova submissão
     */
    createSubmission(userId: number, submissionData: CreateSubmissionRequest, fileInfo?: {
        fileName: string;
        filePath: string;
        fileSize: number;
    }): Promise<SubmissionResponse>;
    /**
     * Busca submissões de um usuário
     */
    getUserSubmissions(userId: number): Promise<SubmissionResponse[]>;
    /**
     * Busca todas as submissões (para professores)
     */
    getAllSubmissions(): Promise<SubmissionResponse[]>;
    /**
     * Atualiza o status de uma submissão com feedback
     */
    updateSubmissionStatus(submissionId: number, status: 'approved' | 'rejected', feedback?: string, reviewedBy?: number): Promise<void>;
    /**
     * Busca uma submissão por ID
     */
    getSubmissionById(submissionId: number): Promise<Submission | null>;
    /**
     * Busca submissões de um usuário específico
     */
    getSubmissionsByUserId(userId: number): Promise<SubmissionResponse[]>;
    /**
     * Busca apenas submissões pendentes
     */
    getPendingSubmissions(): Promise<SubmissionResponse[]>;
    /**
     * Busca submissões já revisadas (aprovadas ou rejeitadas)
     */
    getReviewedSubmissions(): Promise<SubmissionResponse[]>;
}
//# sourceMappingURL=SubmissionService.d.ts.map