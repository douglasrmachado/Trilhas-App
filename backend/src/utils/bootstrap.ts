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
    
    // Verificar se a coluna 'course' existe
    await ensureCourseColumn();
    
    // Verificar se colunas de perfil existem
    await ensureProfileColumns();
    
    // Criar tabela de submissões
    await ensureSubmissionsTable();
    await ensureSubmissionColumns();
    
    // Criar tabela de notificações
    await ensureNotificationsTable();
    
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
 * Garante que a coluna 'course' existe na tabela users
 */
async function ensureCourseColumn() {
  try {
    const [colRows] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'course'`
    );
    
    const colCount = Array.isArray(colRows) && colRows[0] && (colRows[0] as any).cnt 
      ? Number((colRows[0] as any).cnt) 
      : 0;
    
    if (colCount === 0) {
      await pool.query(
        "ALTER TABLE users ADD COLUMN course ENUM('Informática','Meio Ambiente','Produção Cultural','Mecânica') NULL AFTER role"
      );
      console.log("✅ Coluna 'course' adicionada à tabela users");
    } else {
      console.log("✅ Coluna 'course' já existe na tabela users");
    }
  } catch (err) {
    console.error('❌ Erro ao verificar coluna course:', err);
    throw err;
  }
}

/**
 * Garante que as colunas de perfil existem na tabela users
 */
async function ensureProfileColumns() {
  try {
    const profileColumns: Array<{ name: string; ddl: string }> = [
      { name: 'profile_photo', ddl: "ALTER TABLE users ADD COLUMN profile_photo TEXT NULL AFTER course" },
      { name: 'bio', ddl: "ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER profile_photo" },
      { name: 'cover_photo', ddl: "ALTER TABLE users ADD COLUMN cover_photo TEXT NULL AFTER bio" },
    ];

    for (const col of profileColumns) {
      try {
        const [rows] = await pool.query(
          `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
          [col.name]
        );
        const cnt = Array.isArray(rows) && rows[0] && (rows[0] as any).cnt ? Number((rows[0] as any).cnt) : 0;
        if (cnt === 0) {
          await pool.query(col.ddl);
          console.log(`✅ Coluna adicionada em users: ${col.name}`);
        }
      } catch (err) {
        console.error(`❌ Erro ao garantir coluna ${col.name} em users:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/adicionar colunas de perfil em users:', err);
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
          module_id INT UNSIGNED NULL,
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
          INDEX idx_module_id (module_id),
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
 * Garante que colunas necessárias existam em 'submissions'
 */
async function ensureSubmissionColumns() {
  try {
    // Mapear colunas esperadas e seus DDLs
    const expectedColumns: Array<{ name: string; ddl: string }> = [
      { name: 'feedback', ddl: "ALTER TABLE submissions ADD COLUMN feedback TEXT NULL AFTER status" },
      { name: 'reviewed_by', ddl: "ALTER TABLE submissions ADD COLUMN reviewed_by INT NULL AFTER feedback" },
      { name: 'reviewed_at', ddl: "ALTER TABLE submissions ADD COLUMN reviewed_at TIMESTAMP NULL AFTER reviewed_by" },
      { name: 'updated_at', ddl: "ALTER TABLE submissions ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at" },
      { name: 'file_path', ddl: "ALTER TABLE submissions ADD COLUMN file_path VARCHAR(500) NULL AFTER keywords" },
      { name: 'file_name', ddl: "ALTER TABLE submissions ADD COLUMN file_name VARCHAR(255) NULL AFTER file_path" },
      { name: 'file_size', ddl: "ALTER TABLE submissions ADD COLUMN file_size INT NULL AFTER file_name" },
    ];

    for (const col of expectedColumns) {
      try {
        const [rows] = await pool.query(
          `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND COLUMN_NAME = ?`,
          [col.name]
        );
        const cnt = Array.isArray(rows) && rows[0] && (rows[0] as any).cnt ? Number((rows[0] as any).cnt) : 0;
        if (cnt === 0) {
          await pool.query(col.ddl);
          console.log(`✅ Coluna adicionada em submissions: ${col.name}`);
        }
      } catch (err) {
        console.error(`❌ Erro ao garantir coluna ${col.name} em submissions:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/adicionar colunas em submissions:', err);
  }
}

/**
 * Garante que a tabela de notificações existe
 */
async function ensureNotificationsTable() {
  try {
    const [tableRows] = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notifications'`
    );
    
    const tableCount = Array.isArray(tableRows) && tableRows[0] && (tableRows[0] as any).cnt 
      ? Number((tableRows[0] as any).cnt) 
      : 0;
    
    if (tableCount === 0) {
      await pool.query(`
        CREATE TABLE notifications (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNSIGNED NOT NULL,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          body TEXT,
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_is_read (is_read),
          INDEX idx_created_at (created_at)
        )
      `);
      console.log("✅ Tabela 'notifications' criada com sucesso");
    } else {
      console.log("✅ Tabela 'notifications' já existe");
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/criar tabela notifications:', err);
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
