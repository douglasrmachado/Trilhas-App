import pool from '../db';

export interface NotificationRow {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string | null;
  is_read: number;
  created_at: string;
}

export class NotificationService {
  async list(userId: number, onlyUnread: boolean = false, limit: number = 50, offset: number = 0): Promise<NotificationRow[]> {
    const where = onlyUnread ? 'AND is_read = 0' : '';
    const [rows] = await pool.query(
      `SELECT id, user_id, type, title, body, is_read, created_at
       FROM notifications
       WHERE user_id = ? ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return Array.isArray(rows) ? (rows as NotificationRow[]) : [];
  }

  async countUnread(userId: number): Promise<number> {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS cnt FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    const cnt = Array.isArray(rows) && rows[0] && (rows[0] as any).cnt ? Number((rows[0] as any).cnt) : 0;
    return cnt;
  }

  async markAllRead(userId: number): Promise<void> {
    await pool.query(`UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`, [userId]);
  }

  async markRead(notificationId: number, userId: number): Promise<void> {
    await pool.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
  }

  async deleteAll(userId: number): Promise<void> {
    await pool.query(`DELETE FROM notifications WHERE user_id = ?`, [userId]);
  }

  async create(userId: number, type: string, title: string, body?: string): Promise<void> {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)`,
      [userId, type, title, body || null]
    );
  }

  async createForAllProfessors(type: string, title: string, body?: string): Promise<void> {
    const [rows] = await pool.query(`SELECT id FROM users WHERE role = 'professor'`);
    const users = Array.isArray(rows) ? rows as any[] : [];
    if (users.length === 0) return;
    const values = users.map(u => [u.id, type, title, body || null]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ?`,
      [values]
    );
  }
}


