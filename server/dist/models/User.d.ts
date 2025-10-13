export interface User {
    id: number;
    name: string;
    email: string;
    matricula: string;
    password_hash: string;
    role: 'student' | 'professor';
    course?: 'Informática' | 'Meio Ambiente' | 'Produção Cultural' | 'Mecânica';
    created_at?: Date;
    updated_at?: Date;
}
export interface CreateUserRequest {
    name: string;
    email: string;
    registryId: string;
    password: string;
    course?: 'Informática' | 'Meio Ambiente' | 'Produção Cultural' | 'Mecânica';
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: Omit<User, 'password_hash'>;
}
export interface JWTPayload {
    sub: number;
    id?: number;
    email: string;
    role: 'student' | 'professor';
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=User.d.ts.map