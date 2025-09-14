import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { requireProfessor } from '../middleware/auth';
import { registerSchema, loginSchema, createProfessorSchema } from '../validators/authValidators';
import { asyncHandler } from '../utils/errorHandler';

const router = Router();
const authService = new AuthService();

/**
 * @route   POST /auth/register
 * @desc    Registra um novo estudante
 * @access  Public
 */
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  console.log('📝 Tentativa de cadastro recebida:', { email: req.body?.email, name: req.body?.name });
  
  const data = registerSchema.parse(req.body);
  console.log('✅ Dados validados:', { email: data.email, name: data.name, registryId: data.registryId });
  
  await authService.registerStudent(data);
  
  console.log('✅ Usuário cadastrado com sucesso');
  res.status(201).json({ 
    success: true,
    message: 'Usuário cadastrado com sucesso' 
  });
}));

/**
 * @route   POST /auth/login
 * @desc    Autentica um usuário
 * @access  Public
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  console.log('🔐 Tentativa de login recebida:', { email: req.body?.email });
  
  const data = loginSchema.parse(req.body);
  console.log('✅ Dados validados:', { email: data.email });
  
  const result = await authService.login(data);
  
  console.log('🎫 Login realizado com sucesso');
  res.json({
    success: true,
    ...result
  });
}));

/**
 * @route   POST /auth/professors
 * @desc    Cria um novo professor (apenas para professores autenticados)
 * @access  Private (Professor only)
 */
router.post('/professors', requireProfessor, asyncHandler(async (req: Request, res: Response) => {
  console.log('👨‍🏫 Tentativa de criação de professor:', { email: req.body?.email, name: req.body?.name });
  
  const data = createProfessorSchema.parse(req.body);
  console.log('✅ Dados validados:', { email: data.email, name: data.name, registryId: data.registryId });
  
  await authService.registerProfessor(data);
  
  console.log('✅ Professor criado com sucesso');
  res.status(201).json({ 
    success: true,
    message: 'Professor criado com sucesso' 
  });
}));

export default router;


