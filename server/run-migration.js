const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trilhas'
  });

  try {
    console.log('🔄 Executando migração para adicionar campo profile_photo...');
    
    // Verificar se a coluna já existe
    const [columns] = await connection.execute(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_photo'",
      [process.env.DB_NAME || 'trilhas']
    );
    
    if (columns.length === 0) {
      // Adicionar a coluna
      await connection.execute(
        'ALTER TABLE users ADD COLUMN profile_photo TEXT NULL AFTER role'
      );
      console.log('✅ Campo profile_photo adicionado com sucesso!');
    } else {
      console.log('ℹ️ Campo profile_photo já existe na tabela.');
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
