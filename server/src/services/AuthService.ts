import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { User, CreateUserRequest, LoginRequest, AuthResponse, JWTPayload } from '../models/User';

export class AuthService {
  /**
   * Registra um novo usuário (estudante)
   */
  async registerStudent(userData: CreateUserRequest): Promise<void> {
    const { name, email, registryId, password } = userData;
    
    // Verificar se email ou matrícula já existem
    const [existingRows] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR matricula = ?', 
      [email, registryId]
    );
    const existing = Array.isArray(existingRows) && existingRows.length > 0;
    
    if (existing) {
      throw new Error('Email ou matrícula já cadastrado(s)');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Inserir usuário como estudante
    await pool.query(
      'INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, registryId, passwordHash, 'student']
    );
  }

  /**
   * Registra um novo professor (apenas para usuários autenticados como professor)
   */
  async registerProfessor(userData: CreateUserRequest): Promise<void> {
    const { name, email, registryId, password } = userData;
    
    // Verificar se email ou matrícula já existem
    const [existingRows] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR matricula = ?', 
      [email, registryId]
    );
    const existing = Array.isArray(existingRows) && existingRows.length > 0;
    
    if (existing) {
      throw new Error('Email ou matrícula já cadastrado(s)');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Inserir usuário como professor
    await pool.query(
      'INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, registryId, passwordHash, 'professor']
    );
  }

  /**
   * Autentica um usuário e retorna token + dados do usuário
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginData;
    
    // Buscar usuário por email
    const [rows] = await pool.query(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = ?', 
      [email]
    );
    const users = Array.isArray(rows) ? rows : [];
    
    if (!users[0]) {
      throw new Error('Credenciais inválidas');
    }
    
    const user = users[0] as User;
    
    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'dev',
      { expiresIn: '7d' }
    );
    
    // Retornar dados sem a senha
    const { password_hash, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword
    };
  }

  /**
   * Busca usuário por email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    const users = Array.isArray(rows) ? rows : [];
    return users[0] as User || null;
  }

  /**
   * Verifica se um token JWT é válido
   */
  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev') as JWTPayload;
  }
}
