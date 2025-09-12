import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import authRouter from './routes/auth';
import { ZodError } from 'zod';
import pool from './db';
import bcrypt from 'bcrypt';
import { testEmailConnection } from './services/emailService';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.get('/', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(port),'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
};

// Ensure DB migrations and seed initial professor
(async function bootstrap() {
  try {
    // Ensure role column exists (compatible with broader MySQL versions)
    const [colRows] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'`
    );
    const colCount = Array.isArray(colRows) && colRows[0] && (colRows[0] as any).cnt ? Number((colRows[0] as any).cnt) : 0;
    if (colCount === 0) {
      await pool.query(
        "ALTER TABLE users ADD COLUMN role ENUM('student','professor') NOT NULL DEFAULT 'student' AFTER password_hash"
      );
      console.log("Added 'role' column to users table");
    }

    // Ensure password_reset_codes table exists
    console.log('🔍 Verificando tabela password_reset_codes...');
    const [tableRows] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'password_reset_codes'`
    );
    const tableCount = Array.isArray(tableRows) && tableRows[0] && (tableRows[0] as any).cnt ? Number((tableRows[0] as any).cnt) : 0;
    console.log('📊 Tabela password_reset_codes existe:', tableCount > 0 ? '✅ Sim' : '❌ Não');
    
    if (tableCount === 0) {
      console.log('🏗️ Criando tabela password_reset_codes...');
      try {
        await pool.query(`
          CREATE TABLE password_reset_codes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id INT UNSIGNED NOT NULL,
            code VARCHAR(6) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_code (code),
            INDEX idx_expires (expires_at)
          )
        `);
        console.log("✅ Tabela 'password_reset_codes' criada com sucesso");
      } catch (error) {
        console.error('❌ Erro ao criar tabela password_reset_codes:', error instanceof Error ? error.message : String(error));
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const adminName = process.env.ADMIN_NAME || 'Professor Admin';
    const adminRegistry = process.env.ADMIN_REGISTRY || 'PROF-0001';

    if (adminEmail && adminPassword) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ? AND role = ? LIMIT 1', [adminEmail, 'professor']);
      const exists = Array.isArray(rows) && rows.length > 0;
      if (!exists) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await pool.query(
          'INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)',
          [adminName, adminEmail, adminRegistry, passwordHash, 'professor']
        );
        console.log('Seeded initial professor admin:', adminEmail);
      }
    } else {
      console.warn('ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping initial professor seeding');
    }

    // Test email connection
    await testEmailConnection();
  } catch (err) {
    console.error('Bootstrap error:', err);
  }
})();


