import { Router, Request, Response } from 'express';
import { SubmissionService } from '../services/SubmissionService';
import { requireAuth, requireProfessor } from '../middleware/auth';
import { asyncHandler } from '../utils/errorHandler';
import { z } from 'zod';
import pool from '../db';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const router = Router();
const submissionService = new SubmissionService();

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'));
    }
  }
});

// Schema de validação para criação de submissão
const createSubmissionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subject: z.string().min(1, 'Matéria é obrigatória'),
  year: z.string().min(1, 'Ano/Série é obrigatório'),
  contentType: z.string().min(1, 'Tipo de conteúdo é obrigatório'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  keywords: z.string().optional(),
});

/**
 * @route   POST /submissions
 * @desc    Criar uma nova submissão
 * @access  Private (Estudantes)
 */
router.post('/', requireAuth, upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  console.log('📝 Nova submissão recebida:', { 
    userId: req.user?.sub, 
    title: req.body?.title,
    hasFile: !!req.file
  });

  const data = createSubmissionSchema.parse(req.body);
  
  // Verificar se o usuário é estudante
  if (req.user?.role !== 'student') {
    return res.status(403).json({ 
      success: false,
      message: 'Apenas estudantes podem submeter conteúdo' 
    });
  }

  // Preparar informações do arquivo se houver
  let fileInfo = undefined;
  if (req.file) {
    fileInfo = {
      fileName: req.file.originalname,
      filePath: req.file.filename,
      fileSize: req.file.size
    };
    console.log('📎 Arquivo anexado:', fileInfo);
  }

  const submission = await submissionService.createSubmission(
    req.user.sub,
    {
      title: data.title,
      subject: data.subject,
      year: data.year,
      contentType: data.contentType,
      description: data.description,
      ...(data.keywords && { keywords: data.keywords })
    },
    fileInfo
  );

  console.log('✅ Submissão criada com sucesso:', submission.id);

  res.status(201).json({
    success: true,
    message: 'Submissão criada com sucesso',
    data: submission
  });
}));

/**
 * @route   GET /submissions/my
 * @desc    Buscar submissões do usuário logado
 * @access  Private
 */
router.get('/my', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  console.log('📋 Buscando submissões do usuário:', req.user?.sub);

  const submissions = await submissionService.getUserSubmissions(req.user!.sub);

  res.json({
    success: true,
    data: submissions
  });
}));

/**
 * @route   GET /submissions
 * @desc    Buscar todas as submissões (apenas para professores)
 * @access  Private (Professores)
 */
router.get('/', requireProfessor, asyncHandler(async (req: Request, res: Response) => {
  console.log('👨‍🏫 Professor buscando todas as submissões');

  const submissions = await submissionService.getAllSubmissions();

  res.json({
    success: true,
    data: submissions
  });
}));

/**
 * @route   GET /submissions/my
 * @desc    Buscar submissões do usuário logado
 * @access  Private (Estudantes)
 */
router.get('/my', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  console.log('📋 Buscando submissões do usuário:', userId);

  const submissions = await submissionService.getSubmissionsByUserId(userId);

  console.log('✅ Submissões do usuário encontradas:', submissions.length);

  res.json({
    success: true,
    data: submissions
  });
}));

/**
 * @route   GET /submissions/pending
 * @desc    Buscar apenas submissões pendentes (apenas para professores)
 * @access  Private (Professores)
 */
router.get('/pending', requireProfessor, asyncHandler(async (req: Request, res: Response) => {
  console.log('⏳ Professor buscando submissões pendentes');

  const submissions = await submissionService.getPendingSubmissions();

  console.log('✅ Submissões pendentes encontradas:', submissions.length);

  res.json({
    success: true,
    data: submissions
  });
}));

/**
 * @route   GET /submissions/reviewed
 * @desc    Buscar submissões já revisadas (apenas para professores)
 * @access  Private (Professores)
 */
router.get('/reviewed', requireProfessor, asyncHandler(async (req: Request, res: Response) => {
  console.log('📋 Professor buscando submissões revisadas');

  const submissions = await submissionService.getReviewedSubmissions();

  console.log('✅ Submissões revisadas encontradas:', submissions.length);

  res.json({
    success: true,
    data: submissions
  });
}));

/**
 * @route   PUT /submissions/:id/status
 * @desc    Atualizar status de uma submissão com feedback (apenas para professores)
 * @access  Private (Professores)
 */
router.put('/:id/status', requireProfessor, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  console.log('🔄 Atualizando status da submissão:', { id, status, feedback });

  // Validar status
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status deve ser "approved" ou "rejected"'
    });
  }

  // Verificar se a submissão existe
  const submission = await submissionService.getSubmissionById(Number(id));
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submissão não encontrada'
    });
  }

  await submissionService.updateSubmissionStatus(
    Number(id), 
    status, 
    feedback, 
    req.user?.sub
  );

  console.log('✅ Status da submissão atualizado:', { id, status, feedback });

  res.json({
    success: true,
    message: `Submissão ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`
  });
}));

/**
 * @route   GET /submissions/:id
 * @desc    Buscar uma submissão específica
 * @access  Private
 */
router.get('/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log('🔍 Buscando submissão específica:', id);

  const submission = await submissionService.getSubmissionById(Number(id));
  
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submissão não encontrada'
    });
  }

  // Verificar se o usuário pode acessar esta submissão
  if (req.user?.role === 'student' && submission.user_id !== req.user.sub) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado'
    });
  }

  res.json({
    success: true,
    data: submission
  });
}));

/**
 * @route   GET /submissions/test/count
 * @desc    Contar total de submissões no banco (para teste)
 * @access  Private
 */
router.get('/test/count', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  console.log('📊 Testando contagem de submissões no banco');
  
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM submissions');
  const total = (rows as any[])[0].total;
  
  res.json({
    success: true,
    message: `Total de submissões no banco: ${total}`,
    total: total
  });
}));

/**
 * @route   GET /submissions/:id/download
 * @desc    Download do arquivo anexado de uma submissão
 * @access  Private (Professores e autor da submissão)
 */
router.get('/:id/download', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log('📥 Download de arquivo solicitado:', { submissionId: id, userId: req.user?.sub });

  // Buscar informações da submissão
  const submission = await submissionService.getSubmissionById(Number(id));
  
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submissão não encontrada'
    });
  }

  // Verificar se o usuário pode acessar esta submissão
  // Alunos podem baixar:
  // 1. Suas próprias submissões
  // 2. Submissões aprovadas (conteúdos públicos da trilha)
  if (req.user?.role === 'student') {
    const isOwner = submission.user_id === req.user.sub;
    const isApproved = submission.status === 'approved';
    
    if (!isOwner && !isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para baixar este arquivo'
      });
    }
  }

  // Verificar se há arquivo anexado
  if (!submission.file_path || !submission.file_name) {
    return res.status(404).json({
      success: false,
      message: 'Nenhum arquivo anexado encontrado'
    });
  }

  // Verificar se o arquivo existe no sistema de arquivos
  const filePath = path.join(process.cwd(), 'uploads', submission.file_path);
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ Arquivo não encontrado no sistema:', filePath);
    return res.status(404).json({
      success: false,
      message: 'Arquivo não encontrado no servidor'
    });
  }

  // Configurar headers para download
  res.setHeader('Content-Disposition', `attachment; filename="${submission.file_name}"`);
  res.setHeader('Content-Type', 'application/pdf');

  // Enviar o arquivo
  res.download(filePath, submission.file_name, (err) => {
    if (err) {
      console.error('❌ Erro ao enviar arquivo:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Erro ao baixar arquivo'
        });
      }
    } else {
      console.log('✅ Arquivo enviado com sucesso:', submission.file_name);
    }
  });
}));

export default router;
