"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubmissionService_1 = require("../services/SubmissionService");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../utils/errorHandler");
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const submissionService = new SubmissionService_1.SubmissionService();
// Configurar multer para upload de arquivos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Apenas arquivos PDF são permitidos'));
        }
    }
});
// Schema de validação para criação de submissão
const createSubmissionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Título é obrigatório'),
    subject: zod_1.z.string().min(1, 'Matéria é obrigatória'),
    year: zod_1.z.string().min(1, 'Ano/Série é obrigatório'),
    contentType: zod_1.z.string().min(1, 'Tipo de conteúdo é obrigatório'),
    description: zod_1.z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
    keywords: zod_1.z.string().optional(),
});
/**
 * @route   POST /submissions
 * @desc    Criar uma nova submissão
 * @access  Private (Estudantes)
 */
router.post('/', auth_1.requireAuth, upload.single('file'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    const submission = await submissionService.createSubmission(req.user.sub, {
        title: data.title,
        subject: data.subject,
        year: data.year,
        contentType: data.contentType,
        description: data.description,
        ...(data.keywords && { keywords: data.keywords })
    }, fileInfo);
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
router.get('/my', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    console.log('📋 Buscando submissões do usuário:', req.user?.sub);
    const submissions = await submissionService.getUserSubmissions(req.user.sub);
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
router.get('/', auth_1.requireProfessor, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.get('/my', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.get('/pending', auth_1.requireProfessor, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.get('/reviewed', auth_1.requireProfessor, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.put('/:id/status', auth_1.requireProfessor, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    await submissionService.updateSubmissionStatus(Number(id), status, feedback, req.user?.sub);
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
router.get('/:id', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
router.get('/test/count', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    console.log('📊 Testando contagem de submissões no banco');
    const [rows] = await db_1.default.query('SELECT COUNT(*) as total FROM submissions');
    const total = rows[0].total;
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
router.get('/:id/download', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    const filePath = path_1.default.join(process.cwd(), 'uploads', submission.file_path);
    if (!fs_1.default.existsSync(filePath)) {
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
        }
        else {
            console.log('✅ Arquivo enviado com sucesso:', submission.file_name);
        }
    });
}));
exports.default = router;
//# sourceMappingURL=submissions.js.map