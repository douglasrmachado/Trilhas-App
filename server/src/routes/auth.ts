import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { requireProfessor, requireAuth } from '../middleware/auth';
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

/**
 * @route   PUT /auth/profile-photo
 * @desc    Atualiza a foto de perfil do usuário autenticado
 * @access  Private
 */
router.put('/profile-photo', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { photoUri } = req.body;
  const userId = req.user?.id;
  
  if (!photoUri) {
    return res.status(400).json({
      success: false,
      message: 'URL da foto é obrigatória'
    });
  }
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }
  
  console.log('📸 Atualizando foto de perfil:', { userId, photoUri });
  
  await authService.updateProfilePhoto(userId, photoUri);
  
  console.log('✅ Foto de perfil atualizada com sucesso');
  res.json({
    success: true,
    message: 'Foto de perfil atualizada com sucesso'
  });
}));

router.put('/profile', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { bio, cover_photo } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  await authService.updateProfile(userId, { bio, cover_photo });
  
  res.json({
    success: true,
    message: 'Perfil atualizado com sucesso'
  });
}));

export default router;


