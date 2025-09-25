# 🖥️ Trilhas API - Backend

## 🎯 Visão Geral

A Trilhas API é uma API REST desenvolvida em Node.js com TypeScript, fornecendo serviços de autenticação e gerenciamento de conteúdo educacional para o aplicativo mobile Trilhas.

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas
- **Zod** - Validação de schemas
- **mysql2** - Driver MySQL para Node.js
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
server/
├── src/
│   ├── config/             # Configurações centralizadas
│   │   └── index.ts
│   ├── middleware/         # Middlewares personalizados
│   │   └── auth.ts
│   ├── models/            # Interfaces e tipos TypeScript
│   │   ├── User.ts
│   │   └── Submission.ts
│   ├── routes/            # Rotas da API
│   │   ├── auth.ts
│   │   └── submissions.ts
│   ├── services/          # Lógica de negócio
│   │   ├── AuthService.ts
│   │   └── SubmissionService.ts
│   ├── utils/             # Utilitários e helpers
│   │   ├── bootstrap.ts
│   │   └── errorHandler.ts
│   ├── validators/        # Validações com Zod
│   │   └── authValidators.ts
│   ├── db.ts              # Configuração do banco
│   └── index.ts           # Ponto de entrada
├── schema.sql             # Schema do banco de dados
├── package.json           # Dependências
└── tsconfig.json          # Configuração TypeScript
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js LTS instalado
- MySQL em execução
- Banco de dados `trilhas` criado

### Instalação
```bash
cd server
npm install
```

### Configuração
Crie um arquivo `.env` na pasta `server/`:

```env
# Servidor
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=trilhas

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d

# Admin Inicial
ADMIN_EMAIL=admin@trilhas.com
ADMIN_PASSWORD=senha_admin
ADMIN_NAME=Professor Admin
ADMIN_REGISTRY=PROF-0001
```

### Configuração do Banco
Execute o schema SQL:
```bash
mysql -u root -p trilhas < schema.sql
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🏗️ Arquitetura

### Padrão em Camadas
```
Routes → Middleware → Validators → Services → Database
```

### Separação de Responsabilidades
- **Routes**: Roteamento e validação de entrada
- **Services**: Lógica de negócio e interação com banco
- **Middleware**: Autenticação e autorização
- **Validators**: Validação de dados com Zod
- **Models**: Interfaces e tipos TypeScript

## 📋 Endpoints da API

### 🔐 Autenticação

#### POST /auth/register
Registra novo estudante
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "registryId": "123456",
  "password": "senha123"
}
```

#### POST /auth/login
Autentica usuário
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### POST /auth/professors
Cria novo professor (apenas professores)
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "registryId": "PROF-001",
  "password": "senha123"
}
```

#### PUT /auth/profile-photo
Atualiza foto de perfil
```json
{
  "profilePhoto": "data:image/jpeg;base64,..."
}
```

### 📚 Submissões

#### POST /submissions
Cria nova submissão (apenas estudantes)
```json
{
  "title": "Resumo sobre Matemática",
  "subject": "Matemática",
  "year": "9º Ano",
  "contentType": "Resumo",
  "description": "Resumo detalhado...",
  "keywords": "matemática, álgebra"
}
```

#### GET /submissions/my
Busca submissões do usuário logado

#### GET /submissions
Busca todas as submissões (apenas professores)

#### PUT /submissions/:id/status
Atualiza status da submissão (apenas professores)
```json
{
  "status": "approved"
}
```

## 🗄️ Banco de Dados

### Tabela Users
```sql
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  matricula VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','professor') NOT NULL DEFAULT 'student',
  profile_photo TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

### Tabela Submissions
```sql
CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  year VARCHAR(50) NOT NULL,
  content_type ENUM('resumo', 'mapa', 'exercicio', 'apresentacao') NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  file_path VARCHAR(500),
  file_name VARCHAR(255),
  file_size INT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔒 Segurança

### Autenticação JWT
- Tokens com expiração de 7 dias
- Middleware de verificação automática
- Proteção de rotas sensíveis

### Criptografia
- Senhas hasheadas com bcrypt
- Salt automático para cada senha
- Validação de força de senha

### Validação
- Schemas Zod para validação de entrada
- Sanitização de dados
- Prevenção de SQL injection

### Middleware de Segurança
- Rate limiting (100 req/15min por IP)
- CORS configurado
- Headers de segurança com Helmet

## 🧪 Testes

### Testando Endpoints
```bash
# Testar saúde da API
curl http://localhost:3000/

# Testar registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","registryId":"123","password":"123"}'

# Testar login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"123"}'
```

### Logs de Debug
```javascript
// Logs estruturados
console.log('🔐 Login attempt:', { email, timestamp });
console.log('✅ User authenticated:', { userId, role });
console.log('📝 Submission created:', { submissionId, userId });
```

## 📊 Monitoramento

### Métricas Importantes
- Tempo de resposta das APIs
- Taxa de erro das requisições
- Uso de conexões do banco
- Logs de autenticação

### Health Check
```bash
GET /
```
Resposta:
```json
{
  "success": true,
  "message": "Trilhas API está funcionando!",
  "version": "1.0.0",
  "environment": "development"
}
```

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Variáveis de Ambiente de Produção
```env
NODE_ENV=production
PORT=3000
DB_HOST=seu_host_producao
DB_PASSWORD=sua_senha_producao
JWT_SECRET=seu_jwt_secret_super_seguro_producao
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com MySQL**
   - Verificar se MySQL está rodando
   - Confirmar credenciais no `.env`
   - Testar conexão: `mysql -u root -p`

2. **Erro de JWT**
   - Verificar se `JWT_SECRET` está definido
   - Confirmar formato do token
   - Verificar expiração

3. **Erro de validação**
   - Verificar schemas Zod
   - Confirmar formato dos dados enviados
   - Verificar logs de erro

## 📈 Próximas Melhorias

- [ ] Sistema de notificações
- [ ] Cache Redis para performance
- [ ] Logs estruturados com Winston
- [ ] Testes automatizados com Jest
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting por usuário
- [ ] Backup automático do banco
- [ ] Monitoramento com Prometheus

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024
