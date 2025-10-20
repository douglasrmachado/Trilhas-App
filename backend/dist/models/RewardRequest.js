"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardRequest = void 0;
const db_1 = __importDefault(require("../db"));
class RewardRequest {
    constructor(row) {
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
    static async create(data) {
        const [result] = await db_1.default.query(`INSERT INTO reward_requests (student_id, reward_type, message) VALUES (?, ?, ?)`, [data.studentId, data.rewardType, data.message || null]);
        const insertId = result.insertId;
        const [rows] = await db_1.default.query(`SELECT * FROM reward_requests WHERE id = ?`, [insertId]);
        const row = rows[0];
        if (!row)
            throw new Error('RewardRequest not found');
        return new RewardRequest(row);
    }
    static async findById(id) {
        const [rows] = await db_1.default.query(`SELECT * FROM reward_requests WHERE id = ?`, [id]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }
        const row = rows[0];
        if (!row)
            return null;
        return new RewardRequest(row);
    }
    static async findByStudentId(studentId) {
        const [rows] = await db_1.default.query(`SELECT * FROM reward_requests WHERE student_id = ? ORDER BY created_at DESC`, [studentId]);
        return Array.isArray(rows) ? rows.map(row => new RewardRequest(row)) : [];
    }
    static async findPendingForProfessors() {
        const [rows] = await db_1.default.query(`
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
        return Array.isArray(rows) ? rows : [];
    }
    async updateStatus(status, professorId, response) {
        await db_1.default.query(`UPDATE reward_requests 
       SET status = ?, professor_id = ?, professor_response = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`, [status, professorId, response || null, this.id]);
        // Atualizar propriedades locais
        this.status = status;
        this.professorId = professorId;
        this.professorResponse = response || null;
        this.updatedAt = new Date().toISOString();
    }
    getRewardTypeLabel() {
        const labels = {
            'horas_afins': 'Horas Afins',
            'recuperacao_extra': 'Recuperação Extra',
            'pontos_extra': 'Pontos Extra'
        };
        return labels[this.rewardType];
    }
    getStatusLabel() {
        const labels = {
            'pending': 'Pendente',
            'approved': 'Aprovado',
            'rejected': 'Rejeitado'
        };
        return labels[this.status];
    }
}
exports.RewardRequest = RewardRequest;
//# sourceMappingURL=RewardRequest.js.map