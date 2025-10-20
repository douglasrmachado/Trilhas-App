import { z } from 'zod';
/**
 * Schema para validação de registro de usuário
 */
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    registryId: z.ZodString;
    password: z.ZodString;
    course: z.ZodEnum<{
        Informática: "Informática";
        "Meio Ambiente": "Meio Ambiente";
        "Produ\u00E7\u00E3o Cultural": "Produção Cultural";
        Mecânica: "Mecânica";
    }>;
}, z.core.$strip>;
/**
 * Schema para validação de login
 */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
/**
 * Schema para validação de criação de professor
 */
export declare const createProfessorSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    registryId: z.ZodString;
    password: z.ZodString;
    course: z.ZodEnum<{
        Informática: "Informática";
        "Meio Ambiente": "Meio Ambiente";
        "Produ\u00E7\u00E3o Cultural": "Produção Cultural";
        Mecânica: "Mecânica";
    }>;
}, z.core.$strip>;
/**
 * Tipos inferidos dos schemas
 */
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type CreateProfessorRequest = z.infer<typeof createProfessorSchema>;
//# sourceMappingURL=authValidators.d.ts.map