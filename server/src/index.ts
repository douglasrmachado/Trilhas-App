import express from 'express';
import cors from 'cors';
import { json } from 'express';
import authRouter from './routes/auth';
import { errorHandler } from './utils/errorHandler';
import { config, validateConfig } from './config';
import { bootstrapDatabase } from './utils/bootstrap';

const app = express();

// Validar configurações
validateConfig();

// Middlewares globais
app.use(cors(config.cors));
app.use(json());

// Logs de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.get('/', (_req, res) => {
  res.json({ 
    success: true,
    message: 'Trilhas API está funcionando!',
    version: '1.0.0',
    environment: config.server.nodeEnv
  });
});

app.use('/auth', authRouter);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Inicializar servidor
app.listen(Number(config.server.port), config.server.host, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${config.server.port}`);
  console.log(`📊 Ambiente: ${config.server.nodeEnv}`);
  console.log(`🗄️  Banco: ${config.database.host}:${config.database.port}/${config.database.database}`);
});

// Bootstrap do banco de dados
bootstrapDatabase();


