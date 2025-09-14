# 🏗️ Arquitetura do Backend - Trilhas API

## 📁 Estrutura de Pastas

```
server/src/
├── config/           # Configurações centralizadas
│   └── index.ts     # Configurações da aplicação
├── middleware/       # Middlewares personalizados
│   └── auth.ts      # Middlewares de autenticação
├── models/          # Interfaces e tipos TypeScript
│   └── User.ts      # Modelos relacionados ao usuário
├── routes/           # Rotas da API
│   └── auth.ts      # Rotas de autenticação
├── services/        # Lógica de negócio
│   └── AuthService.ts # Serviços de autenticação
├── utils/           # Utilitários e helpers
│   ├── bootstrap.ts # Inicialização do banco
│   └── errorHandler.ts # Tratamento de erros
├── validators/      # Validações com Zod
│   └── authValidators.ts # Schemas de validação
├── db.ts           # Configuração do banco de dados
└── index.ts        # Ponto de entrada da aplicação
```

## 🎯 Padrões Arquiteturais

### 1. **Arquitetura em Camadas (Layered Architecture)**

- **Routes**: Recebem requisições e delegam para services
- **Services**: Contêm a lógica de negócio
- **Models**: Definem interfaces e tipos
- **Middleware**: Interceptam requisições para validação/auth
- **Utils**: Funções auxiliares e inicialização

### 2. **Separação de Responsabilidades**

- **Routes**: Apenas roteamento e validação de entrada
- **Services**: Lógica de negócio e interação com banco
- **Middleware**: Autenticação e autorização
- **Validators**: Validação de dados com Zod
- **Error Handler**: Tratamento centralizado de erros

### 3. **Dependency Injection**

- Services são instanciados nas rotas
- Configurações centralizadas no `config/index.ts`
- Banco de dados configurado separadamente

## 🔧 Configuração

### Variáveis de Ambiente

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
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=7d

# Admin Inicial
ADMIN_EMAIL=admin@trilhas.com
ADMIN_PASSWORD=senha_admin
ADMIN_NAME=Professor Admin
ADMIN_REGISTRY=PROF-0001
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 📋 Endpoints da API

### Autenticação

- `POST /auth/register` - Registra novo estudante
- `POST /auth/login` - Autentica usuário
- `POST /auth/professors` - Cria professor (apenas professores)

### Respostas Padronizadas

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

## 🛡️ Segurança

- **JWT**: Tokens com expiração de 7 dias
- **bcrypt**: Hash de senhas com salt
- **Zod**: Validação de entrada
- **Middleware**: Verificação de roles
- **CORS**: Configuração de origem

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 📊 Monitoramento

- Logs estruturados com timestamps
- Monitoramento de conexões do banco
- Tratamento de erros centralizado
- Validação de configurações na inicialização
