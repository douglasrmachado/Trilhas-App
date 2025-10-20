"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const db_1 = __importDefault(require("../db"));
class NotificationService {
    async list(userId, onlyUnread = false, limit = 50, offset = 0) {
        const where = onlyUnread ? 'AND is_read = 0' : '';
        const [rows] = await db_1.default.query(`SELECT id, user_id, type, title, body, is_read, created_at
       FROM notifications
       WHERE user_id = ? ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`, [userId, limit, offset]);
        return Array.isArray(rows) ? rows : [];
    }
    async countUnread(userId) {
        const [rows] = await db_1.default.query(`SELECT COUNT(*) AS cnt FROM notifications WHERE user_id = ? AND is_read = 0`, [userId]);
        const cnt = Array.isArray(rows) && rows[0] && rows[0].cnt ? Number(rows[0].cnt) : 0;
        return cnt;
    }
    async markAllRead(userId) {
        await db_1.default.query(`UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`, [userId]);
    }
    async markRead(notificationId, userId) {
        await db_1.default.query(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [notificationId, userId]);
    }
    async deleteAll(userId) {
        await db_1.default.query(`DELETE FROM notifications WHERE user_id = ?`, [userId]);
    }
    async create(userId, type, title, body) {
        await db_1.default.query(`INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)`, [userId, type, title, body || null]);
    }
    async createForAllProfessors(type, title, body) {
        const [rows] = await db_1.default.query(`SELECT id FROM users WHERE role = 'professor'`);
        const users = Array.isArray(rows) ? rows : [];
        if (users.length === 0)
            return;
        const values = users.map(u => [u.id, type, title, body || null]);
        await db_1.default.query(`INSERT INTO notifications (user_id, type, title, body) VALUES ?`, [values]);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map