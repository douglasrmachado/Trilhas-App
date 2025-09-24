const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateWithSimpleImage() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trilhas'
  });

  try {
    console.log('🖼️ Atualizando com imagem simples...');
    
    // Imagem base64 simples (1x1 pixel vermelho)
    const simpleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    await connection.execute(
      'UPDATE users SET profile_photo = ? WHERE id = ?',
      [simpleImage, 1]
    );
    
    console.log('✅ Imagem simples adicionada');
    
    // Verificar
    const [users] = await connection.execute(
      'SELECT id, name, profile_photo FROM users WHERE id = 1'
    );
    
    console.log('👤 Usuário atualizado:');
    console.log(`  - Foto: ${users[0].profile_photo ? 'PRESENTE' : 'NULL'}`);
    console.log(`  - URI: ${users[0].profile_photo}`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await connection.end();
  }
}

updateWithSimpleImage();
