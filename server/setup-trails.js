const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupTrails() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🔄 Iniciando setup do sistema de trilhas...\n');
    
    // 1. Criar schema
    console.log('📋 Criando tabelas...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'create_trails_system.sql'),
      'utf8'
    );
    await connection.query(schemaSQL);
    console.log('✅ Tabelas criadas com sucesso!\n');
    
    // 2. Popular dados
    console.log('📦 Inserindo dados iniciais...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'seed_trails_data.sql'),
      'utf8'
    );
    await connection.query(seedSQL);
    console.log('✅ Dados inseridos com sucesso!\n');
    
    // 3. Verificar dados
    console.log('🔍 Verificando dados inseridos...');
    const [trails] = await connection.execute('SELECT COUNT(*) as count FROM trilhas.trails');
    const [modules] = await connection.execute('SELECT COUNT(*) as count FROM trilhas.modules');
    const [achievements] = await connection.execute('SELECT COUNT(*) as count FROM trilhas.achievements');
    
    console.log(`✅ ${trails[0].count} trilhas criadas`);
    console.log(`✅ ${modules[0].count} módulos criados`);
    console.log(`✅ ${achievements[0].count} conquistas criadas\n`);
    
    console.log('🎉 Setup concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

setupTrails().catch(err => {
  console.error('❌ Falha fatal:', err);
  process.exit(1);
});

