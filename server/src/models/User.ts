export interface User {
  id: number;
  name: string;
  email: string;
  matricula: string;
  password_hash: string;
  role: 'student' | 'professor';
  profile_photo?: string;
  bio?: string;
  cover_photo?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  registryId: string;
  password: string;
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
  id: number;
  email: string;
  role: 'student' | 'professor';
  iat?: number;
  exp?: number;
}
