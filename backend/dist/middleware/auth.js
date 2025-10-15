"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireProfessor = requireProfessor;
exports.requireStudent = requireStudent;
const AuthService_1 = require("../services/AuthService");
/**
 * Middleware para verificar autenticação básica
 */
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length)
            : '';
        if (!token) {
            return res.status(401).json({ message: 'Token ausente' });
        }
        const authService = new AuthService_1.AuthService();
        const payload = authService.verifyToken(token);
        // Adicionar id ao payload para compatibilidade
        req.user = { ...payload, id: payload.sub };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
/**
 * Middleware para verificar se o usuário é professor
 */
function requireProfessor(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length)
            : '';
        if (!token) {
            return res.status(401).json({ message: 'Token ausente' });
        }
        const authService = new AuthService_1.AuthService();
        const payload = authService.verifyToken(token);
        if (payload?.role !== 'professor') {
            return res.status(403).json({ message: 'Acesso negado - apenas professores' });
        }
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
/**
 * Middleware para verificar se o usuário é estudante
 */
function requireStudent(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length)
            : '';
        if (!token) {
            return res.status(401).json({ message: 'Token ausente' });
        }
        const authService = new AuthService_1.AuthService();
        const payload = authService.verifyToken(token);
        if (payload?.role !== 'student') {
            return res.status(403).json({ message: 'Acesso negado - apenas estudantes' });
        }
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
//# sourceMappingURL=auth.js.map