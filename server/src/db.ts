import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Drm321512!',
  database: process.env.DB_DATABASE || 'trilhas',
  connectionLimit: 20
});

export default pool;


