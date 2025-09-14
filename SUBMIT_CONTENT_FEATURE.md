# 📝 Funcionalidade de Submissão de Conteúdo

## 🎯 Visão Geral

A funcionalidade de **Submissão de Conteúdo** permite que estudantes compartilhem seus conhecimentos criando resumos, mapas conceituais, exercícios e apresentações para ajudar outros estudantes.

## 🏗️ Arquitetura Implementada

### **Frontend (React Native)**
- **Tela**: `SubmitContentScreen.jsx`
- **Navegação**: Integrada ao App.js
- **Validação**: Validação de formulário em tempo real
- **Upload**: Seleção de arquivos PDF com expo-document-picker

### **Backend (Node.js + TypeScript)**
- **Modelo**: `Submission.ts` - Interfaces e tipos
- **Service**: `SubmissionService.ts` - Lógica de negócio
- **Rotas**: `submissions.ts` - Endpoints da API
- **Banco**: Tabela `submissions` com relacionamento com `users`

## 📱 Interface do Usuário

### **Seções do Formulário:**

1. **📋 Informações Básicas**
   - Título (obrigatório)
   - Matéria (dropdown)
   - Ano/Série (dropdown)
   - Tipo de Conteúdo (dropdown com ícones)

2. **📝 Descrição do Conteúdo**
   - Descrição detalhada (obrigatório)
   - Palavras-chave (opcional)

3. **📎 Anexar Arquivo**
   - Upload de PDF (máximo 10MB)
   - Validação de formato e tamanho

### **Funcionalidades:**
- ✅ Validação em tempo real
- ✅ Dropdowns interativos
- ✅ Upload de arquivos
- ✅ Tema claro/escuro
- ✅ Responsivo para diferentes telas

## 🔧 Endpoints da API

### **POST /submissions**
Criar nova submissão (apenas estudantes)

```json
{
  "title": "Resumo sobre Equações do 2º Grau",
  "subject": "Matemática",
  "year": "9º Ano",
  "contentType": "Resumo",
  "description": "Resumo detalhado sobre...",
  "keywords": "equações, matemática, álgebra"
}
```

### **GET /submissions/my**
Buscar submissões do usuário logado

### **GET /submissions**
Buscar todas as submissões (apenas professores)

### **PUT /submissions/:id/status**
Atualizar status da submissão (apenas professores)

## 🗄️ Estrutura do Banco de Dados

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
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔐 Segurança e Validação

### **Frontend:**
- Validação de campos obrigatórios
- Validação de tamanho de arquivo (10MB)
- Validação de formato (PDF apenas)

### **Backend:**
- Autenticação JWT obrigatória
- Verificação de role (estudantes podem submeter)
- Validação com Zod schemas
- Sanitização de dados

## 🚀 Como Usar

### **Para Estudantes:**
1. Fazer login como estudante
2. Na HomeScreen, clicar em "Submeter Conteúdo"
3. Preencher o formulário completo
4. Anexar arquivo PDF (opcional)
5. Clicar em "Submeter Conteúdo"

### **Para Professores:**
1. Fazer login como professor
2. Acessar endpoint `/submissions` para ver todas as submissões
3. Usar endpoint `/submissions/:id/status` para aprovar/rejeitar

## 📊 Status das Submissões

- **pending**: Aguardando análise do professor
- **approved**: Aprovada e disponível para outros estudantes
- **rejected**: Rejeitada (com feedback do professor)

## 🔄 Fluxo Completo

```
Estudante → Preenche Formulário → Submete → Status: pending
     ↓
Professor → Analisa Conteúdo → Aprova/Rejeita → Status: approved/rejected
     ↓
Sistema → Notifica Estudante → Conteúdo Disponível (se aprovado)
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React Native, Expo, expo-document-picker
- **Backend**: Node.js, TypeScript, Express, MySQL
- **Validação**: Zod schemas
- **Autenticação**: JWT tokens
- **Arquitetura**: Services, Models, Routes pattern

## 📈 Próximas Melhorias

- [ ] Sistema de notificações
- [ ] Upload de múltiplos arquivos
- [ ] Preview de arquivos PDF
- [ ] Sistema de comentários
- [ ] Métricas de uso do conteúdo
- [ ] Sistema de avaliações
