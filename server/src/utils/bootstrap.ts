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
