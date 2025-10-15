# 🏗️ Arquitetura do Sistema - Trilhas

## 📊 Visão Geral

O Sistema Trilhas é uma aplicação educacional gamificada composta por:

- **Frontend**: App mobile React Native com Expo
- **Backend**: API REST em Node.js com TypeScript
- **Banco de Dados**: MySQL com sistema de gamificação

## 🎯 Objetivo

Criar uma plataforma onde estudantes podem:
- Navegar por trilhas de aprendizado
- Completar módulos e ganhar XP
- Fazer submissões de conteúdo
- Receber feedback de professores

## 🏛️ Arquitetura Técnica

### Frontend (React Native + Expo)
```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── screens/        # Telas da aplicação
│   ├── context/        # Contextos React (Auth, Theme)
│   └── config/         # Configurações da API
└── assets/             # Imagens e recursos
```

**Tecnologias:**
- React Native
- Expo
- React Navigation
- Context API
- Axios

### Backend (Node.js + TypeScript)
```
backend/
├── src/
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   ├── services/       # Lógica de negócio
│   ├── middleware/     # Middlewares (Auth, CORS)
│   ├── utils/          # Utilitários
│   └── validators/     # Validação de dados
├── database/
│   ├── migrations/     # Scripts de banco
│   └── seeds/          # Dados iniciais
└── uploads/            # Arquivos enviados
```

**Tecnologias:**
- Node.js
- Express.js
- TypeScript
- MySQL2
- JWT (Autenticação)
- Multer (Upload de arquivos)

## 🎮 Sistema de Gamificação

### Conceitos Principais

**Trilhas:** Conjuntos de módulos organizados por curso
**Módulos:** Unidades de aprendizado individuais
**XP:** Pontos de experiência por completar módulos
**Conquistas:** Badges por marcos alcançados
**Progresso:** Acompanhamento do aprendizado

### Fluxo do Usuário

1. **Login/Cadastro** → Autenticação JWT
2. **Explorar Trilhas** → Lista baseada no curso
3. **Acessar Módulos** → Conteúdo e exercícios
4. **Fazer Submissão** → Upload de arquivos
5. **Receber Feedback** → Aprovação/rejeição
6. **Ganhar XP** → Sistema de pontuação

## 🔄 Fluxo de Dados

### Autenticação
```
Frontend → Login → Backend → JWT → Frontend
```

### Submissões
```
Frontend → Upload → Backend → Database
Professor → Review → Backend → Notification → Student
```

### Gamificação
```
Student → Complete Module → Trigger → Update XP → Achievement
```

## 🗄️ Banco de Dados

### Tabelas Principais

**users:** Usuários (estudantes e professores)
**trails:** Trilhas de aprendizado
**modules:** Módulos dentro das trilhas
**submissions:** Submissões dos estudantes
**user_progress:** Progresso nos módulos
**achievements:** Conquistas disponíveis
**user_xp:** Sistema de pontuação

### Relacionamentos

- **1:N** User → Submissions
- **1:N** Trail → Modules
- **1:N** User → Progress
- **N:N** User ↔ Achievements

## 🔒 Segurança

### Autenticação
- **JWT Tokens** para sessões
- **Middleware** de autenticação
- **Roles** (student/professor)

### Autorização
- **Professores** podem revisar submissões
- **Estudantes** podem fazer submissões
- **Middleware** de verificação de roles

### Uploads
- **Validação** de tipos de arquivo
- **Limite** de tamanho
- **Sanitização** de nomes

## 📱 Funcionalidades

### Para Estudantes
- ✅ Login/Cadastro
- ✅ Explorar trilhas
- ✅ Acessar módulos
- ✅ Fazer submissões
- ✅ Ver progresso e XP
- ✅ Receber notificações

### Para Professores
- ✅ Todas funcionalidades de estudante
- ✅ Revisar submissões
- ✅ Aprovar/rejeitar conteúdo
- ✅ Dar feedback
- ✅ Criar outros professores

## 🚀 Deploy

### Desenvolvimento
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

### Produção
- **Backend**: Deploy em servidor com PM2
- **Frontend**: Build para Google Play/App Store
- **Database**: MySQL em servidor dedicado

## 🔧 Manutenção

### Backup
- **Banco de dados**: Backup diário
- **Uploads**: Backup de arquivos
- **Código**: Versionamento com Git

### Monitoramento
- **Logs** de erro
- **Métricas** de performance
- **Uptime** do sistema

## 📈 Futuras Melhorias

- [ ] Notificações push
- [ ] Chat entre usuários
- [ ] Relatórios avançados
- [ ] Integração com LMS
- [ ] App web complementar
