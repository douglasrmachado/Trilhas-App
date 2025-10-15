# 🔌 Documentação da API - Sistema Trilhas

## 🌐 Endpoints Base

**URL Base:** `http://localhost:3000`

## 🔐 Autenticação

### POST /auth/login
**Descrição:** Login de usuário
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "student"
  }
}
```

### POST /auth/register
**Descrição:** Cadastro de novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "registryId": "123456",
  "password": "senha123",
  "course": "Informática"
}
```

## 📚 Trilhas e Módulos

### GET /trails
**Descrição:** Listar trilhas disponíveis
**Headers:** `Authorization: Bearer {token}`

### GET /trails/:id
**Descrição:** Detalhes de uma trilha específica

### GET /trails/:id/modules
**Descrição:** Módulos de uma trilha

## 📝 Submissões

### POST /submissions
**Descrição:** Criar nova submissão
**Headers:** `Authorization: Bearer {token}`

### GET /submissions/my
**Descrição:** Minhas submissões

### GET /submissions/pending
**Descrição:** Submissões pendentes (professores)

### PUT /submissions/:id/status
**Descrição:** Aprovar/rejeitar submissão
**Headers:** `Authorization: Bearer {token}` (apenas professores)

## 🔔 Notificações

### GET /notifications
**Descrição:** Listar notificações do usuário
**Headers:** `Authorization: Bearer {token}`

### PUT /notifications/read-all
**Descrição:** Marcar todas como lidas

## 👤 Perfil

### PUT /auth/profile-photo
**Descrição:** Atualizar foto de perfil
**Headers:** `Authorization: Bearer {token}`

### PUT /auth/profile
**Descrição:** Atualizar dados do perfil
**Headers:** `Authorization: Bearer {token}`

## 📊 Status Codes

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Não autenticado
- **403** - Acesso negado
- **404** - Não encontrado
- **500** - Erro interno do servidor

## 🔒 Autenticação

Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer {seu_jwt_token}
```

## 📝 Exemplo de Uso

```javascript
// Login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@email.com',
    password: 'senha123'
  })
});

const data = await response.json();
const token = data.token;

// Usar token em requisições
const trails = await fetch('http://localhost:3000/trails', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```
