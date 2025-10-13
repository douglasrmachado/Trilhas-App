const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function resetTrailsSystem() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'trilhas',
    multipleStatements: true
  });

  try {
    console.log('🔄 Resetando sistema de trilhas...\n');
    
    // 1. Remover tabelas antigas
    console.log('🗑️  Removendo tabelas antigas...');
    await connection.query(`
      SET FOREIGN_KEY_CHECKS = 0;
      DROP TABLE IF EXISTS user_achievements;
      DROP TABLE IF EXISTS achievements;
      DROP TABLE IF EXISTS user_xp;
      DROP TABLE IF EXISTS user_progress;
      DROP TABLE IF EXISTS modules;
      DROP TABLE IF EXISTS trails;
      SET FOREIGN_KEY_CHECKS = 1;
    `);
    console.log('✅ Tabelas removidas!\n');
    
    // 2. Adicionar coluna course à tabela users (se não existir)
    console.log('📋 Verificando campo course na tabela users...');
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN course ENUM('Informática','Meio Ambiente','Produção Cultural','Mecânica') NULL 
        AFTER role;
      `);
      console.log('✅ Campo course adicionado!\n');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Campo course já existe!\n');
      } else {
        throw err;
      }
    }
    
    // 3. Criar tabelas do sistema de trilhas
    console.log('📋 Criando tabelas do sistema de trilhas...');
    const createTrailsSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'create_trails_system.sql'),
      'utf8'
    );
    await connection.query(createTrailsSQL);
    console.log('✅ Tabelas criadas!\n');
    
    // 4. Popular com dados iniciais
    console.log('📦 Inserindo trilhas e módulos...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'seed_trails_data.sql'),
      'utf8'
    );
    await connection.query(seedSQL);
    console.log('✅ Dados inseridos!\n');
    
    // 5. Verificar dados
    console.log('🔍 Verificando dados inseridos...');
    const [trails] = await connection.execute('SELECT COUNT(*) as count FROM trails');
    const [modules] = await connection.execute('SELECT COUNT(*) as count FROM modules');
    const [achievements] = await connection.execute('SELECT COUNT(*) as count FROM achievements');
    
    console.log(`✅ ${trails[0].count} trilhas criadas`);
    console.log(`✅ ${modules[0].count} módulos criados`);
    console.log(`✅ ${achievements[0].count} conquistas criadas\n`);
    
    console.log('🎉 Sistema de trilhas resetado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o reset:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

resetTrailsSystem().catch(err => {
  console.error('❌ Falha fatal:', err);
  process.exit(1);
});


