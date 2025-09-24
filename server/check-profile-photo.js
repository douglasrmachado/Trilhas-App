const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkProfilePhotoField() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trilhas'
  });

  try {
    console.log('🔍 Verificando campo profile_photo...');
    
    // Verificar estrutura da tabela
    const [columns] = await connection.execute(
      "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
      [process.env.DB_NAME || 'trilhas']
    );
    
    console.log('📋 Colunas da tabela users:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar dados dos usuários
    const [users] = await connection.execute(
      'SELECT id, name, email, profile_photo FROM users LIMIT 5'
    );
    
    console.log('👥 Dados dos usuários:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Nome: ${user.name}, Email: ${user.email}, Foto: ${user.profile_photo || 'NULL'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar campo:', error);
  } finally {
    await connection.end();
  }
}

checkProfilePhotoField();
