import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json } from 'express';
import path from 'path';
import authRouter from './routes/auth';
import submissionsRouter from './routes/submissions';
import notificationsRouter from './routes/notifications';
import trailsRouter from './routes/trails';
import { errorHandler } from './utils/errorHandler';
import { config, validateConfig } from './config';
import { bootstrapDatabase } from './utils/bootstrap';

const app = express();

// Validar configurações
validateConfig();

// Middlewares de segurança e performance
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitado para desenvolvimento
  crossOriginEmbedderPolicy: false
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middlewares globais
app.use(cors(config.cors));
app.use(json({ limit: '10mb' })); // Limite de tamanho para uploads

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
app.use('/submissions', submissionsRouter);
app.use('/notifications', notificationsRouter);
app.use('/trails', trailsRouter);

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


