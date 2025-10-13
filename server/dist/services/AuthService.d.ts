import { User, CreateUserRequest, LoginRequest, AuthResponse, JWTPayload } from '../models/User';
export declare class AuthService {
    /**
     * Registra um novo usuário (estudante)
     */
    registerStudent(userData: CreateUserRequest): Promise<void>;
    /**
     * Registra um novo professor (apenas para usuários autenticados como professor)
     */
    registerProfessor(userData: CreateUserRequest): Promise<void>;
    /**
     * Autentica um usuário e retorna token + dados do usuário
     */
    login(loginData: LoginRequest): Promise<AuthResponse>;
    /**
     * Busca usuário por email
     */
    findUserByEmail(email: string): Promise<User | null>;
    /**
     * Atualiza a foto de perfil do usuário
     */
    updateProfilePhoto(userId: number, photoUri: string): Promise<void>;
    updateProfile(userId: number, profileData: {
        bio?: string;
        cover_photo?: string;
    }): Promise<void>;
    /**
     * Verifica se um token JWT é válido
     */
    verifyToken(token: string): JWTPayload;
}
//# sourceMappingURL=AuthService.d.ts.map