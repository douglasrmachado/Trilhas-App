import { createPool } from 'mysql2/promise';
import { config } from './config';

const pool = createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: config.database.connectionLimit,
});

// Event listeners para monitoramento da conexão
pool.on('connection', (connection) => {
  console.log('🔗 Nova conexão estabelecida com o banco de dados');
});

pool.on('enqueue', () => {
  console.log('⏳ Aguardando conexão disponível no pool');
});

export default pool;


