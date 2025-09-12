const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Drm321512!',
      database: process.env.DB_DATABASE || 'trilhas',
    });

    console.log('✅ Conectado ao banco de dados');

    // Verificar estrutura da tabela users
    const [rows] = await connection.execute('DESCRIBE users');
    console.log('\n📋 Estrutura da tabela users:');
    console.table(rows);

    // Testar inserção
    console.log('\n🧪 Testando inserção...');
    const testData = {
      name: 'Teste Usuario',
      email: 'teste@teste.com',
      matricula: 'TEST123',
      password: '123456'
    };

    // Verificar se já existe
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR matricula = ?',
      [testData.email, testData.matricula]
    );

    if (existing.length > 0) {
      console.log('⚠️  Usuário de teste já existe, removendo...');
      await connection.execute('DELETE FROM users WHERE email = ?', [testData.email]);
    }

    // Inserir usuário de teste
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(testData.password, 10);
    
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [testData.name, testData.email, testData.matricula, passwordHash, 'student']
    );

    console.log('✅ Usuário inserido com sucesso! ID:', result.insertId);

    // Limpar teste
    await connection.execute('DELETE FROM users WHERE id = ?', [result.insertId]);
    console.log('🧹 Usuário de teste removido');

    await connection.end();
    console.log('\n🎉 Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testDatabase();
