# 🚀 Guia de Configuração - Sistema Trilhas

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **MySQL** (versão 8.0 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (para o frontend mobile)

## 🛠️ Configuração do Backend

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar banco de dados
```bash
# Criar arquivo .env na pasta backend/
# Copiar configurações do .env.example
```

### 3. Configurar MySQL
```bash
# Executar no MySQL Workbench:
# Abrir: backend/database/migrations/001_create_users_table.sql
# Executar o script completo
```

### 4. Iniciar servidor
```bash
cd backend
npm run dev
```

## 📱 Configuração do Frontend

### 1. Instalar dependências
```bash
cd frontend
npm install
```

### 2. Iniciar aplicação
```bash
cd frontend
npm start
```

### 3. Testar no dispositivo
- **Android**: Scan QR code com Expo Go
- **iOS**: Scan QR code com Camera
- **Web**: Pressionar 'w' no terminal

## ✅ Verificação

### Backend funcionando:
- ✅ Servidor rodando em http://localhost:3000
- ✅ Banco de dados conectado
- ✅ API respondendo

### Frontend funcionando:
- ✅ App carregando
- ✅ Login funcionando
- ✅ Navegação entre telas

## 🔧 Troubleshooting

### Erro de conexão com banco:
- Verificar se MySQL está rodando
- Conferir credenciais no .env
- Executar migrations novamente

### Erro no frontend:
- Limpar cache: `npx expo start -c`
- Reinstalar dependências: `rm -rf node_modules && npm install`

## 📞 Suporte

Para dúvidas, consulte:
- [Documentação da API](api.md)
- [Arquitetura do Sistema](architecture.md)
- README.md na pasta raiz
