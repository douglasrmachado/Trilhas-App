import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
/**
 * Middleware para verificar autenticação básica
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware para verificar se o usuário é professor
 */
export declare function requireProfessor(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware para verificar se o usuário é estudante
 */
export declare function requireStudent(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map