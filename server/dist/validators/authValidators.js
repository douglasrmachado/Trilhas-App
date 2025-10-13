"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfessorSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema para validação de registro de usuário
 */
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    registryId: zod_1.z.string().min(1, 'Matrícula é obrigatória'),
    password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    course: zod_1.z.enum(['Informática', 'Meio Ambiente', 'Produção Cultural', 'Mecânica']),
});
/**
 * Schema para validação de login
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
/**
 * Schema para validação de criação de professor
 */
exports.createProfessorSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    registryId: zod_1.z.string().min(1, 'Matrícula é obrigatória'),
    password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
//# sourceMappingURL=authValidators.js.map