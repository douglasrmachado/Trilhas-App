# 🏗️ Diagrama da Arquitetura - Trilhas API

## 📊 Fluxo de Requisição

```
Cliente (Frontend)
    ↓ HTTP Request
Routes (auth.ts)
    ↓ Validação + Middleware
Validators (authValidators.ts)
    ↓ Dados Validados
Services (AuthService.ts)
    ↓ Lógica de Negócio
Database (MySQL)
    ↓ Resposta
Response (JSON)
```

## 🎯 Estrutura em Camadas

```
┌─────────────────────────────────────┐
│           🌐 CLIENTE               │
│        (React Native App)          │
└─────────────────┬───────────────────┘
                  │ HTTP/HTTPS
┌─────────────────▼───────────────────┐
│           🛣️  ROUTES                │
│         (Express Router)            │
│  • Recebe requisições               │
│  • Valida entrada                   │
│  • Delega para services             │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         🔒 MIDDLEWARE               │
│      (Autenticação/Autorização)     │
│  • Verifica JWT                     │
│  • Valida roles                     │
│  • Adiciona user ao request         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         ✅ VALIDATORS               │
│           (Zod Schemas)             │
│  • Validação de entrada             │
│  • Type safety                      │
│  • Mensagens de erro padronizadas   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         🏢 SERVICES                 │
│        (Lógica de Negócio)          │
│  • Regras de negócio                │
│  • Interação com banco              │
│  • Criptografia                     │
│  • Geração de tokens                │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         🗄️  DATABASE                │
│            (MySQL)                  │
│  • Persistência de dados            │
│  • Pool de conexões                 │
│  • Transações                       │
└─────────────────────────────────────┘
```

## 🔄 Fluxo de Autenticação

```
1. 📝 REGISTER
   Cliente → Routes → Validators → AuthService → Database
   ↓
   Resposta: { success: true, message: "Usuário cadastrado" }

2. 🔐 LOGIN
   Cliente → Routes → Validators → AuthService → Database
   ↓
   Resposta: { success: true, token: "jwt_token", user: {...} }

3. 👨‍🏫 CREATE PROFESSOR
   Cliente → Routes → Middleware (requireProfessor) → Validators → AuthService → Database
   ↓
   Resposta: { success: true, message: "Professor criado" }
```

## 📁 Organização de Arquivos

```
server/src/
├── 📁 config/
│   └── index.ts          # ⚙️ Configurações centralizadas
├── 📁 middleware/
│   └── auth.ts           # 🔒 Middlewares de autenticação
├── 📁 models/
│   └── User.ts           # 📋 Interfaces e tipos
├── 📁 routes/
│   └── auth.ts           # 🛣️ Rotas da API
├── 📁 services/
│   └── AuthService.ts    # 🏢 Lógica de negócio
├── 📁 utils/
│   ├── bootstrap.ts      # 🚀 Inicialização do banco
│   └── errorHandler.ts   # ❌ Tratamento de erros
├── 📁 validators/
│   └── authValidators.ts # ✅ Validações Zod
├── db.ts                 # 🗄️ Configuração do banco
└── index.ts             # 🎯 Ponto de entrada
```

## 🎨 Padrões Utilizados

### 1. **Repository Pattern** (Implícito)
- Services abstraem acesso ao banco
- Facilita testes e manutenção

### 2. **Dependency Injection**
- Services instanciados nas rotas
- Configurações centralizadas

### 3. **Middleware Pattern**
- Interceptação de requisições
- Autenticação/autorização

### 4. **Error Handling Pattern**
- Tratamento centralizado
- Logs estruturados

### 5. **Configuration Pattern**
- Variáveis de ambiente centralizadas
- Validação de configurações

## 🚀 Benefícios da Arquitetura

✅ **Escalabilidade**: Fácil adicionar novas funcionalidades
✅ **Manutenibilidade**: Código organizado e modular
✅ **Testabilidade**: Services isolados e testáveis
✅ **Segurança**: Middleware de autenticação robusto
✅ **Type Safety**: TypeScript + Zod para validação
✅ **Monitoramento**: Logs estruturados e tratamento de erros
