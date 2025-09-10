import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import express from 'express';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  registryId: z.string().min(1),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ? OR matricula = ?', [data.email, data.registryId]);
    const existing = Array.isArray(existingRows) && existingRows.length > 0;
    if (existing) return res.status(409).json({ message: 'Email ou matrícula já cadastrado(s)' });

    const passwordHash = await bcrypt.hash(data.password, 10);
    // Force student role on public registration
    await pool.query('INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)', [
      data.name,
      data.email,
      data.registryId,
      passwordHash,
      'student',
    ]);
    return res.status(201).json({ message: 'Usuário cadastrado' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const [rows] = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [data.email]);
    const users = Array.isArray(rows) ? rows : [];
    if (!users[0]) return res.status(401).json({ message: 'Credenciais inválidas' });
    const user = users[0] as any;
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev', {
      expiresIn: '7d',
    });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.post('/forgot', async (req, res, next) => {
  try {
    // No-op for now; pretend success.
    const email = String(req.body?.email || '');
    if (!email) return res.status(400).json({ message: 'Email obrigatório' });
    return res.json({ message: 'Se existir, enviaremos instruções ao email' });
  } catch (err) {
    next(err);
  }
});

// Middleware para autenticação e checagem de role
function requireAuthProfessor(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ')
      ? auth.substring('Bearer '.length)
      : '';
    if (!token) return res.status(401).json({ message: 'Token ausente' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any;
    if (payload?.role !== 'professor') return res.status(403).json({ message: 'Acesso negado' });
    (req as any).user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Endpoint protegido para criar professores
const createProfessorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  registryId: z.string().min(1),
  password: z.string().min(6),
});

router.post('/professors', requireAuthProfessor, async (req, res, next) => {
  try {
    const data = createProfessorSchema.parse(req.body);
    const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ? OR matricula = ?', [data.email, data.registryId]);
    const existing = Array.isArray(existingRows) && existingRows.length > 0;
    if (existing) return res.status(409).json({ message: 'Email ou matrícula já cadastrado(s)' });

    const passwordHash = await bcrypt.hash(data.password, 10);
    await pool.query('INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)', [
      data.name,
      data.email,
      data.registryId,
      passwordHash,
      'professor',
    ]);
    return res.status(201).json({ message: 'Professor criado' });
  } catch (err) {
    next(err);
  }
});

export default router;


