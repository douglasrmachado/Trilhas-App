import { Request, Response, NextFunction } from 'express';
/**
 * Classe customizada para erros da aplicação
 */
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
/**
 * Middleware global de tratamento de erros
 */
export declare function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void;
/**
 * Função para criar erros customizados
 */
export declare function createError(message: string, statusCode?: number): AppError;
/**
 * Async wrapper para capturar erros em funções async
 */
export declare function asyncHandler(fn: Function): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map