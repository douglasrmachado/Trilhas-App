import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Classe customizada para erros da aplicação
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de tratamento de erros
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
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
  if (err instanceof ZodError) {
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
export function createError(message: string, statusCode: number = 500): AppError {
  return new AppError(message, statusCode);
}

/**
 * Async wrapper para capturar erros em funções async
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
