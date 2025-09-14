# 📚 Exemplos de Uso da API - Trilhas

## 🔐 Autenticação

### 1. Registrar Estudante

```bash
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "registryId": "123456",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso"
}
```

### 2. Fazer Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "student"
  }
}
```

### 3. Criar Professor (Apenas para Professores)

```bash
POST /auth/professors
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "registryId": "PROF-001",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Professor criado com sucesso"
}
```

## 🛠️ Exemplos com JavaScript/TypeScript

### Frontend (React Native)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Registrar usuário
async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('Usuário registrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error.response.data);
    throw error;
  }
}

// Fazer login
async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    // Salvar token no AsyncStorage
    await AsyncStorage.setItem('auth_token', response.data.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error.response.data);
    throw error;
  }
}

// Criar professor (com autenticação)
async function createProfessor(professorData) {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    
    const response = await axios.post(`${API_URL}/auth/professors`, professorData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao criar professor:', error.response.data);
    throw error;
  }
}
```

### Backend (Teste com curl)

```bash
# Testar registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@email.com",
    "registryId": "999999",
    "password": "senha123"
  }'

# Testar login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }'

# Testar criação de professor (substitua TOKEN pelo token retornado no login)
curl -X POST http://localhost:3000/auth/professors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Professor Teste",
    "email": "prof@email.com",
    "registryId": "PROF-999",
    "password": "senha123"
  }'
```

## 📋 Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Acesso negado (role incorreto)
- **409**: Conflito (email/matrícula já existe)
- **500**: Erro interno do servidor

## 🔍 Exemplos de Erros

### Validação de Dados
```json
{
  "success": false,
  "message": "Dados inválidos"
}
```

### Credenciais Inválidas
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

### Acesso Negado
```json
{
  "success": false,
  "message": "Acesso negado - apenas professores"
}
```

### Email Já Cadastrado
```json
{
  "success": false,
  "message": "Email ou matrícula já cadastrado(s)"
}
```

## 🧪 Testando a API

### 1. Verificar se o servidor está rodando
```bash
curl http://localhost:3000/
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Trilhas API está funcionando!",
  "version": "1.0.0",
  "environment": "development"
}
```

### 2. Fluxo completo de teste
1. Registrar um estudante
2. Fazer login com o estudante
3. Usar o token para criar um professor (se o usuário for professor)
4. Testar endpoints protegidos
