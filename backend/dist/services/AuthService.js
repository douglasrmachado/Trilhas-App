"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
class AuthService {
    /**
     * Registra um novo usuário (estudante)
     */
    async registerStudent(userData) {
        const { name, email, registryId, password, course } = userData;
        // Verificar se email ou matrícula já existem
        const [existingRows] = await db_1.default.query('SELECT id FROM users WHERE email = ? OR matricula = ?', [email, registryId]);
        const existing = Array.isArray(existingRows) && existingRows.length > 0;
        if (existing) {
            throw new Error('Email ou matrícula já cadastrado(s)');
        }
        // Hash da senha
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // Inserir usuário como estudante (curso é obrigatório para estudantes)
        await db_1.default.query('INSERT INTO users (name, email, matricula, password_hash, role, course) VALUES (?, ?, ?, ?, ?, ?)', [name, email, registryId, passwordHash, 'student', course]);
    }
    /**
     * Registra um novo professor (apenas para usuários autenticados como professor)
     */
    async registerProfessor(userData) {
        const { name, email, registryId, password } = userData;
        // Verificar se email ou matrícula já existem
        const [existingRows] = await db_1.default.query('SELECT id FROM users WHERE email = ? OR matricula = ?', [email, registryId]);
        const existing = Array.isArray(existingRows) && existingRows.length > 0;
        if (existing) {
            throw new Error('Email ou matrícula já cadastrado(s)');
        }
        // Hash da senha
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // Inserir usuário como professor
        await db_1.default.query('INSERT INTO users (name, email, matricula, password_hash, role) VALUES (?, ?, ?, ?, ?)', [name, email, registryId, passwordHash, 'professor']);
    }
    /**
     * Autentica um usuário e retorna token + dados do usuário
     */
    async login(loginData) {
        const { email, password } = loginData;
        // Buscar usuário por email
        const [rows] = await db_1.default.query('SELECT id, name, email, role, course, profile_photo, bio, cover_photo, password_hash FROM users WHERE email = ?', [email]);
        const users = Array.isArray(rows) ? rows : [];
        if (!users[0]) {
            throw new Error('Credenciais inválidas');
        }
        const user = users[0];
        // Verificar senha
        const isValidPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Credenciais inválidas');
        }
        // Gerar token JWT
        const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
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
    async findUserByEmail(email) {
        const [rows] = await db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        const users = Array.isArray(rows) ? rows : [];
        return users[0] || null;
    }
    /**
     * Atualiza a foto de perfil do usuário
     */
    async updateProfilePhoto(userId, photoUri) {
        await db_1.default.query('UPDATE users SET profile_photo = ? WHERE id = ?', [photoUri, userId]);
    }
    async updateProfile(userId, profileData) {
        const updates = [];
        const values = [];
        if (profileData.bio !== undefined) {
            updates.push('bio = ?');
            values.push(profileData.bio);
        }
        if (profileData.cover_photo !== undefined) {
            updates.push('cover_photo = ?');
            values.push(profileData.cover_photo);
        }
        if (updates.length === 0) {
            return;
        }
        values.push(userId);
        await db_1.default.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    /**
     * Verifica se um token JWT é válido
     */
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'dev');
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map