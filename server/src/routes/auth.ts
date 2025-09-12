import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import express from 'express';
import { sendPasswordResetCode } from '../services/emailService';

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
    console.log('📝 Tentativa de cadastro recebida:', { email: req.body?.email, name: req.body?.name });
    
    const data = registerSchema.parse(req.body);
    console.log('✅ Dados validados:', { email: data.email, name: data.name, registryId: data.registryId });
    
    const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ? OR matricula = ?', [data.email, data.registryId]);
    const existing = Array.isArray(existingRows) && existingRows.length > 0;
    console.log('🔍 Verificação de duplicatas:', existing ? '❌ Email/matrícula já existe' : '✅ Disponível');
    
    if (existing) {
      console.log('❌ Cadastro rejeitado - duplicata');
      return res.status(409).json({ message: 'Email ou matrícula já cadastrado(s)' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    console.log('🔒 Senha hasheada com sucesso');
    
    // Force student role on public registration
    await pool.query('INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)', [
      data.name,
      data.email,
      data.registryId,
      passwordHash,
      'student',
    ]);
    
    console.log('✅ Usuário cadastrado com sucesso');
    return res.status(201).json({ message: 'Usuário cadastrado' });
  } catch (err) {
    console.error('💥 Erro no cadastro:', err);
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    console.log('🔐 Tentativa de login recebida:', { email: req.body?.email });
    
    const data = loginSchema.parse(req.body);
    console.log('✅ Dados validados:', { email: data.email });
    
    const [rows] = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [data.email]);
    const users = Array.isArray(rows) ? rows : [];
    console.log('👥 Usuários encontrados:', users.length);
    
    if (!users[0]) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const user = users[0] as any;
    console.log('👤 Usuário encontrado:', { id: user.id, name: user.name, email: user.email, role: user.role });
    
    const ok = await bcrypt.compare(data.password, user.password_hash);
    console.log('🔒 Verificação de senha:', ok ? '✅ OK' : '❌ FALHOU');
    
    if (!ok) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev', {
      expiresIn: '7d',
    });
    
    console.log('🎫 Token gerado com sucesso');
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('💥 Erro no login:', err);
    next(err);
  }
});

// Endpoint para solicitar recuperação de senha
router.post('/forgot', async (req, res, next) => {
  try {
    console.log('📧 Solicitação de recuperação de senha:', { email: req.body?.email });
    
    const data = resetPasswordSchema.parse(req.body);
    console.log('✅ Email validado:', data.email);
    
    // Verificar se o email existe
    const [rows] = await pool.query('SELECT id, name FROM users WHERE email = ?', [data.email]);
    const users = Array.isArray(rows) ? rows : [];
    console.log('👥 Usuários encontrados:', users.length);
    
    if (!users[0]) {
      console.log('❌ Email não encontrado - retornando sucesso por segurança');
      // Por segurança, sempre retorna sucesso mesmo se email não existir
      return res.json({ message: 'Se o email existir, enviaremos um código de recuperação' });
    }
    
    const user = users[0] as any;
    console.log('👤 Usuário encontrado:', { id: user.id, name: user.name });
    
    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código gerado:', code);
    
    // Definir expiração (15 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    console.log('⏰ Expira em:', expiresAt.toISOString());
    
    // Invalidar códigos anteriores do usuário
    await pool.query('UPDATE password_reset_codes SET used = TRUE WHERE user_id = ?', [user.id]);
    console.log('🗑️ Códigos anteriores invalidados');
    
    // Inserir novo código
    await pool.query(
      'INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES (?, ?, ?)',
      [user.id, code, expiresAt]
    );
    console.log('💾 Código salvo no banco');
    
    // Enviar email
    console.log('📤 Enviando email...');
    const emailSent = await sendPasswordResetCode(data.email, code, user.name);
    console.log('📧 Resultado do envio:', emailSent ? '✅ Sucesso' : '❌ Falhou');
    
    if (emailSent) {
      return res.json({ message: 'Código de recuperação enviado para seu email' });
    } else {
      return res.status(500).json({ message: 'Erro ao enviar email. Tente novamente.' });
    }
  } catch (err) {
    console.error('💥 Erro na recuperação de senha:', err);
    next(err);
  }
});

// Endpoint para verificar código e redefinir senha
router.post('/reset-password', async (req, res, next) => {
  try {
    const data = verifyCodeSchema.parse(req.body);
    
    // Verificar se o código existe e é válido
    const [rows] = await pool.query(`
      SELECT prc.id, prc.user_id, u.name 
      FROM password_reset_codes prc 
      JOIN users u ON prc.user_id = u.id 
      WHERE u.email = ? AND prc.code = ? AND prc.used = FALSE AND prc.expires_at > NOW()
    `, [data.email, data.code]);
    
    const codes = Array.isArray(rows) ? rows : [];
    
    if (!codes[0]) {
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }
    
    const codeData = codes[0] as any;
    
    // Hash da nova senha
    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    
    // Atualizar senha do usuário
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, codeData.user_id]);
    
    // Marcar código como usado
    await pool.query('UPDATE password_reset_codes SET used = TRUE WHERE id = ?', [codeData.id]);
    
    return res.json({ message: 'Senha redefinida com sucesso' });
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

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
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


