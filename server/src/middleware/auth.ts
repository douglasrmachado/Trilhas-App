import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { JWTPayload } from '../models/User';

// Estender o tipo Request para incluir user
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
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : '';
    
    if (!token) {
      return res.status(401).json({ message: 'Token ausente' });
    }

    const authService = new AuthService();
    const payload = authService.verifyToken(token);
    
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

/**
 * Middleware para verificar se o usuário é professor
 */
export function requireProfessor(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : '';
    
    if (!token) {
      return res.status(401).json({ message: 'Token ausente' });
    }

    const authService = new AuthService();
    const payload = authService.verifyToken(token);
    
    if (payload?.role !== 'professor') {
      return res.status(403).json({ message: 'Acesso negado - apenas professores' });
    }
    
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

/**
 * Middleware para verificar se o usuário é estudante
 */
export function requireStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : '';
    
    if (!token) {
      return res.status(401).json({ message: 'Token ausente' });
    }

    const authService = new AuthService();
    const payload = authService.verifyToken(token);
    
    if (payload?.role !== 'student') {
      return res.status(403).json({ message: 'Acesso negado - apenas estudantes' });
    }
    
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
