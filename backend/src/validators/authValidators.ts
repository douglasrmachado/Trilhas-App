import { z } from 'zod';

/**
 * Schema para validação de registro de usuário
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  registryId: z.string().min(1, 'Matrícula é obrigatória'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  course: z.enum(['Informática', 'Meio Ambiente', 'Produção Cultural', 'Mecânica']),
});

/**
 * Schema para validação de login
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

/**
 * Schema para validação de criação de professor
 */
export const createProfessorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  registryId: z.string().min(1, 'Matrícula é obrigatória'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

/**
 * Tipos inferidos dos schemas
 */
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type CreateProfessorRequest = z.infer<typeof createProfessorSchema>;
