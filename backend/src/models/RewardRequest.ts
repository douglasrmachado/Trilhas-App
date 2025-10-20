import pool from '../db';

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

export class RewardRequest {
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

  constructor(row: RewardRequestRow) {
    this.id = row.id;
    this.studentId = row.student_id;
    this.rewardType = row.reward_type;
    this.pointsCost = row.points_cost;
    this.message = row.message;
    this.status = row.status;
    this.professorId = row.professor_id;
    this.professorResponse = row.professor_response;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async create(data: {
    studentId: number;
    rewardType: 'horas_afins' | 'recuperacao_extra' | 'pontos_extra';
    message?: string;
  }): Promise<RewardRequest> {
    const [result] = await pool.query(
      `INSERT INTO reward_requests (student_id, reward_type, message) VALUES (?, ?, ?)`,
      [data.studentId, data.rewardType, data.message || null]
    );
    
    const insertId = (result as any).insertId;
    const [rows] = await pool.query(
      `SELECT * FROM reward_requests WHERE id = ?`,
      [insertId]
    );
    
    const row = (rows as RewardRequestRow[])[0];
    if (!row) throw new Error('RewardRequest not found');
    return new RewardRequest(row);
  }

  static async findById(id: number): Promise<RewardRequest | null> {
    const [rows] = await pool.query(
      `SELECT * FROM reward_requests WHERE id = ?`,
      [id]
    );
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }
    
    const row = (rows as RewardRequestRow[])[0];
    if (!row) return null;
    return new RewardRequest(row);
  }

  static async findByStudentId(studentId: number): Promise<RewardRequest[]> {
    const [rows] = await pool.query(
      `SELECT * FROM reward_requests WHERE student_id = ? ORDER BY created_at DESC`,
      [studentId]
    );
    
    return Array.isArray(rows) ? (rows as RewardRequestRow[]).map(row => new RewardRequest(row)) : [];
  }

  static async findPendingForProfessors(): Promise<RewardRequestWithStudent[]> {
    const [rows] = await pool.query(`
      SELECT 
        rr.*,
        u.name as student_name,
        u.email as student_email,
        p.name as professor_name
      FROM reward_requests rr
      JOIN users u ON rr.student_id = u.id
      LEFT JOIN users p ON rr.professor_id = p.id
      WHERE rr.status = 'pending'
      ORDER BY rr.created_at ASC
    `);
    
    return Array.isArray(rows) ? (rows as RewardRequestWithStudent[]) : [];
  }

  async updateStatus(
    status: 'approved' | 'rejected',
    professorId: number,
    response?: string
  ): Promise<void> {
    await pool.query(
      `UPDATE reward_requests 
       SET status = ?, professor_id = ?, professor_response = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, professorId, response || null, this.id]
    );
    
    // Atualizar propriedades locais
    this.status = status;
    this.professorId = professorId;
    this.professorResponse = response || null;
    this.updatedAt = new Date().toISOString();
  }

  getRewardTypeLabel(): string {
    const labels = {
      'horas_afins': 'Horas Afins',
      'recuperacao_extra': 'Recuperação Extra',
      'pontos_extra': 'Pontos Extra'
    };
    return labels[this.rewardType];
  }

  getStatusLabel(): string {
    const labels = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    };
    return labels[this.status];
  }
}
