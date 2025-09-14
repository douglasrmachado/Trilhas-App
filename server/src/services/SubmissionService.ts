import pool from '../db';
import { Submission, CreateSubmissionRequest, SubmissionResponse } from '../models/Submission';

export class SubmissionService {
  /**
   * Cria uma nova submissão
   */
  async createSubmission(userId: number, submissionData: CreateSubmissionRequest, fileInfo?: {
    fileName: string;
    filePath: string;
    fileSize: number;
  }): Promise<SubmissionResponse> {
    const {
      title,
      subject,
      year,
      contentType,
      description,
      keywords
    } = submissionData;

    // Converter contentType para o formato do banco
    const contentTypeMap: { [key: string]: string } = {
      'Resumo': 'resumo',
      'Mapa Conceitual': 'mapa',
      'Exercícios': 'exercicio',
      'Apresentação': 'apresentacao'
    };

    const dbContentType = contentTypeMap[contentType] || 'resumo';

    const query = `
      INSERT INTO submissions (
        user_id, title, subject, year, content_type, 
        description, keywords, file_path, file_name, file_size, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      title,
      subject,
      year,
      dbContentType,
      description,
      keywords || null,
      fileInfo?.filePath || null,
      fileInfo?.fileName || null,
      fileInfo?.fileSize || null,
      'pending'
    ];

    const [result] = await pool.query(query, values) as any;
    
    // Buscar a submissão criada
    const [rows] = await pool.query(
      'SELECT * FROM submissions WHERE id = ?',
      [result.insertId]
    );
    
    const submissions = rows as Submission[];
    const submission = submissions[0];
    
    if (!submission) {
      throw new Error('Erro ao criar submissão');
    }
    
    return {
      id: submission.id!,
      title: submission.title,
      subject: submission.subject,
      year: submission.year,
      content_type: submission.content_type,
      description: submission.description,
      keywords: submission.keywords || undefined,
      file_name: submission.file_name || undefined,
      status: submission.status,
      created_at: submission.created_at!
    };
  }

  /**
   * Busca submissões de um usuário
   */
  async getUserSubmissions(userId: number): Promise<SubmissionResponse[]> {
    const [rows] = await pool.query(
      'SELECT * FROM submissions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return (rows as Submission[]).map(submission => ({
      id: submission.id!,
      title: submission.title,
      subject: submission.subject,
      year: submission.year,
      content_type: submission.content_type,
      description: submission.description,
      keywords: submission.keywords || undefined,
      file_name: submission.file_name || undefined,
      status: submission.status,
      created_at: submission.created_at!
    }));
  }

  /**
   * Busca todas as submissões (para professores)
   */
  async getAllSubmissions(): Promise<SubmissionResponse[]> {
    const [rows] = await pool.query(`
      SELECT s.*, u.name as user_name, u.email as user_email 
      FROM submissions s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.created_at DESC
    `);

    return (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      subject: row.subject,
      year: row.year,
      content_type: row.content_type,
      description: row.description,
      keywords: row.keywords,
      file_name: row.file_name,
      status: row.status,
      created_at: row.created_at,
      user_name: row.user_name,
      user_email: row.user_email
    }));
  }

  /**
   * Atualiza o status de uma submissão com feedback
   */
  async updateSubmissionStatus(
    submissionId: number, 
    status: 'approved' | 'rejected', 
    feedback?: string,
    reviewedBy?: number
  ): Promise<void> {
    await pool.query(
      'UPDATE submissions SET status = ?, feedback = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW() WHERE id = ?',
      [status, feedback || null, reviewedBy || null, submissionId]
    );
  }

  /**
   * Busca uma submissão por ID
   */
  async getSubmissionById(submissionId: number): Promise<Submission | null> {
    const [rows] = await pool.query(
      'SELECT * FROM submissions WHERE id = ?',
      [submissionId]
    );

    const submissions = rows as Submission[];
    return submissions.length > 0 ? submissions[0]! : null;
  }

  /**
   * Busca submissões de um usuário específico
   */
  async getSubmissionsByUserId(userId: number): Promise<SubmissionResponse[]> {
    const [rows] = await pool.query(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM submissions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [userId]
    ) as any;

    return rows.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      subject: row.subject,
      year: row.year,
      content_type: row.content_type,
      description: row.description,
      keywords: row.keywords,
      file_path: row.file_path,
      file_name: row.file_name,
      file_size: row.file_size,
      status: row.status,
      feedback: row.feedback,
      reviewed_by: row.reviewed_by,
      reviewed_at: row.reviewed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_name: row.user_name,
      user_email: row.user_email
    }));
  }

  /**
   * Busca apenas submissões pendentes
   */
  async getPendingSubmissions(): Promise<SubmissionResponse[]> {
    const [rows] = await pool.query(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM submissions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.status = 'pending'
       ORDER BY s.created_at ASC`,
      []
    ) as any;

    return rows.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      subject: row.subject,
      year: row.year,
      content_type: row.content_type,
      description: row.description,
      keywords: row.keywords,
      file_path: row.file_path,
      file_name: row.file_name,
      file_size: row.file_size,
      status: row.status,
      feedback: row.feedback,
      reviewed_by: row.reviewed_by,
      reviewed_at: row.reviewed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_name: row.user_name,
      user_email: row.user_email
    }));
  }

  /**
   * Busca submissões já revisadas (aprovadas ou rejeitadas)
   */
  async getReviewedSubmissions(): Promise<SubmissionResponse[]> {
    const [rows] = await pool.query(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM submissions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.status IN ('approved', 'rejected')
       ORDER BY s.reviewed_at DESC`,
      []
    ) as any;

    return rows.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      subject: row.subject,
      year: row.year,
      content_type: row.content_type,
      description: row.description,
      keywords: row.keywords,
      file_path: row.file_path,
      file_name: row.file_name,
      file_size: row.file_size,
      status: row.status,
      feedback: row.feedback,
      reviewed_by: row.reviewed_by,
      reviewed_at: row.reviewed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_name: row.user_name,
      user_email: row.user_email
    }));
  }
}
