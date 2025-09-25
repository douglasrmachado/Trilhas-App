const mysql = require('mysql2/promise');
require('dotenv').config();

async function testProfilePhotoUpdate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trilhas'
  });

  try {
    console.log('🧪 Testando atualização de foto de perfil...');
    
    // Atualizar foto do usuário Douglas (ID: 1)
    const testPhotoUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
    
    await connection.execute(
      'UPDATE users SET profile_photo = ? WHERE id = ?',
      [testPhotoUri, 1]
    );
    
    console.log('✅ Foto de teste adicionada para o usuário Douglas');
    
    // Verificar se foi atualizada
    const [users] = await connection.execute(
      'SELECT id, name, email, profile_photo FROM users WHERE id = 1'
    );
    
    console.log('👤 Usuário atualizado:');
    console.log(`  - ID: ${users[0].id}`);
    console.log(`  - Nome: ${users[0].name}`);
    console.log(`  - Email: ${users[0].email}`);
    console.log(`  - Foto: ${users[0].profile_photo ? 'PRESENTE' : 'NULL'}`);
    console.log(`  - URI: ${users[0].profile_photo ? users[0].profile_photo.substring(0, 50) + '...' : 'NULL'}`);
    
  } catch (error) {
    console.error('❌ Erro ao testar atualização:', error);
  } finally {
    await connection.end();
  }
}

testProfilePhotoUpdate();

