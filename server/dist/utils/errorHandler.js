"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.createError = createError;
exports.asyncHandler = asyncHandler;
const zod_1 = require("zod");
/**
 * Classe customizada para erros da aplicação
 */
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Middleware global de tratamento de erros
 */
function errorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;
    // Log do erro (exceto 404 para evitar spam)
    if (err.statusCode !== 404) {
        console.error('❌ Erro:', {
            message: err.message,
            statusCode: err.statusCode || 500,
            stack: err.stack,
            url: req.url,
            method: req.method,
        });
    }
    // Erro de validação Zod
    if (err instanceof zod_1.ZodError) {
        const message = 'Dados inválidos';
        error = new AppError(message, 400);
    }
    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token inválido';
        error = new AppError(message, 401);
    }
    // Erro de expiração do JWT
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expirado';
        error = new AppError(message, 401);
    }
    // Erro de conexão com banco
    if (err.code === 'ECONNREFUSED') {
        const message = 'Erro de conexão com o banco de dados';
        error = new AppError(message, 500);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
/**
 * Função para criar erros customizados
 */
function createError(message, statusCode = 500) {
    return new AppError(message, statusCode);
}
/**
 * Async wrapper para capturar erros em funções async
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=errorHandler.js.map