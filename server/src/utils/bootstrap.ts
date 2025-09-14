import bcrypt from 'bcrypt';
import pool from '../db';
import { config } from '../config';

/**
 * Inicializa o banco de dados com migrações e dados iniciais
 */
export async function bootstrapDatabase() {
  try {
    console.log('🔄 Inicializando banco de dados...');
    
    // Verificar se a coluna 'role' existe
    await ensureRoleColumn();
    
    // Criar tabela de submissões
    await ensureSubmissionsTable();
    
    // Criar usuário admin inicial
    await seedInitialAdmin();
    
    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (err) {
    console.error('❌ Erro na inicialização do banco:', err);
  }
}

/**
 * Garante que a coluna 'role' existe na tabela users
 */
async function ensureRoleColumn() {
  try {
    const [colRows] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'`
    );
    
    const colCount = Array.isArray(colRows) && colRows[0] && (colRows[0] as any).cnt 
      ? Number((colRows[0] as any).cnt) 
      : 0;
    
    if (colCount === 0) {
      await pool.query(
        "ALTER TABLE users ADD COLUMN role ENUM('student','professor') NOT NULL DEFAULT 'student' AFTER password_hash"
      );
      console.log("✅ Coluna 'role' adicionada à tabela users");
    } else {
      console.log("✅ Coluna 'role' já existe na tabela users");
    }
  } catch (err) {
    console.error('❌ Erro ao verificar coluna role:', err);
    throw err;
  }
}

/**
 * Garante que a tabela de submissões existe
 */
async function ensureSubmissionsTable() {
  try {
    const [tableRows] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions'`
    );
    
    const tableCount = Array.isArray(tableRows) && tableRows[0] && (tableRows[0] as any).cnt 
      ? Number((tableRows[0] as any).cnt) 
      : 0;
    
    if (tableCount === 0) {
      await pool.query(`
        CREATE TABLE submissions (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNSIGNED NOT NULL,
          title VARCHAR(255) NOT NULL,
          subject VARCHAR(100) NOT NULL,
          year VARCHAR(50) NOT NULL,
          content_type ENUM('resumo', 'mapa', 'exercicio', 'apresentacao') NOT NULL DEFAULT 'resumo',
          description TEXT NOT NULL,
          keywords TEXT,
          file_path VARCHAR(500),
          file_name VARCHAR(255),
          file_size INT,
          status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status),
          INDEX idx_created_at (created_at)
        )
      `);
      console.log("✅ Tabela 'submissions' criada com sucesso");
    } else {
      console.log("✅ Tabela 'submissions' já existe");
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/criar tabela submissions:', err);
    throw err;
  }
}

/**
 * Cria o usuário admin inicial se não existir
 */
async function seedInitialAdmin() {
  const { admin } = config;
  
  if (!admin.email || !admin.password) {
    console.warn('⚠️  ADMIN_EMAIL/ADMIN_PASSWORD não configurados; pulando criação do admin inicial');
    return;
  }

  try {
    // Verificar se o admin já existe
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND role = ? LIMIT 1', 
      [admin.email, 'professor']
    );
    
    const exists = Array.isArray(rows) && rows.length > 0;
    
    if (!exists) {
      const passwordHash = await bcrypt.hash(admin.password, 10);
      
      await pool.query(
        'INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [admin.name, admin.email, admin.registry, passwordHash, 'professor']
      );
      
      console.log(`✅ Admin inicial criado: ${admin.email}`);
    } else {
      console.log(`✅ Admin inicial já existe: ${admin.email}`);
    }
  } catch (err) {
    console.error('❌ Erro ao criar admin inicial:', err);
    throw err;
  }
}
