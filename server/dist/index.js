"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_2 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const trails_1 = __importDefault(require("./routes/trails"));
const errorHandler_1 = require("./utils/errorHandler");
const config_1 = require("./config");
const bootstrap_1 = require("./utils/bootstrap");
const app = (0, express_1.default)();
// Validar configurações
(0, config_1.validateConfig)();
// Middlewares de segurança e performance
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Desabilitado para desenvolvimento
    crossOriginEmbedderPolicy: false
}));
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use((0, cors_1.default)(config_1.config.cors));
app.use((0, express_2.json)({ limit: '10mb' })); // Limite de tamanho para uploads
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
        environment: config_1.config.server.nodeEnv
    });
});
app.use('/auth', auth_1.default);
app.use('/submissions', submissions_1.default);
app.use('/notifications', notifications_1.default);
app.use('/trails', trails_1.default);
// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler_1.errorHandler);
// Inicializar servidor
app.listen(Number(config_1.config.server.port), config_1.config.server.host, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${config_1.config.server.port}`);
    console.log(`📊 Ambiente: ${config_1.config.server.nodeEnv}`);
    console.log(`🗄️  Banco: ${config_1.config.database.host}:${config_1.config.database.port}/${config_1.config.database.database}`);
});
// Bootstrap do banco de dados
(0, bootstrap_1.bootstrapDatabase)();
//# sourceMappingURL=index.js.map