import pool from '../db';
import { Submission, CreateSubmissionRequest, SubmissionResponse } from '../models/Submission';
import { NotificationService } from './NotificationService';

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
    // Se for aprovação, associar ao módulo correto
    let moduleId = null;
    
    if (status === 'approved') {
      // Buscar dados da submissão
      const [subRows] = await pool.query(
        'SELECT subject, year FROM submissions WHERE id = ?',
        [submissionId]
      );
      const submission = (subRows as any[])[0];
      
      if (submission) {
        // Mapear ano para order_index do módulo
        const yearToModuleMap: { [key: string]: number } = {
          '1º': 1,
          '2º': 2,
          '3º': 3,
          '4º': 4
        };
        
        const moduleOrder = yearToModuleMap[submission.year];
        
        if (moduleOrder) {
          // Buscar o módulo correspondente
          const [moduleRows] = await pool.query(`
            SELECT m.id 
            FROM modules m
            INNER JOIN trails t ON t.id = m.trail_id
            WHERE t.title = ? AND m.order_index = ?
            LIMIT 1
          `, [submission.subject, moduleOrder]);
          
          if (Array.isArray(moduleRows) && moduleRows.length > 0) {
            moduleId = (moduleRows[0] as any).id;
            console.log(`✅ Submissão aprovada associada ao módulo ${moduleId}`);
          }
        }
      }
    }
    
    // Atualizar submissão
    await pool.query(
      'UPDATE submissions SET status = ?, module_id = ?, feedback = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW() WHERE id = ?',
      [status, moduleId, feedback || null, reviewedBy || null, submissionId]
    );

    // Criar notificação para o autor da submissão
    const [rows] = await pool.query('SELECT user_id, title FROM submissions WHERE id = ?', [submissionId]);
    const sub = (rows as any[])[0];
    if (sub && sub.user_id) {
      const notif = new NotificationService();
      const title = status === 'approved' ? 'Submissão aprovada' : 'Submissão rejeitada';
      const body = `Seu conteúdo "${sub.title}" foi ${status === 'approved' ? 'aprovado' : 'rejeitado'}.`;
      const notificationType = status === 'approved' ? 'submission_approved' : 'submission_rejected';
      await notif.create(sub.user_id, notificationType, title, body);
    }
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
