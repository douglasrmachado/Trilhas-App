# 🎓 Trilhas - Plataforma Educacional

## 📖 Sobre o Projeto

O Trilhas é uma plataforma educacional completa que permite aos estudantes compartilharem conhecimento através de submissões de conteúdo educacional. O sistema inclui um aplicativo mobile desenvolvido em React Native e uma API REST em Node.js com TypeScript.

## 🎯 Funcionalidades Principais

- **🔐 Sistema de Autenticação**: Login, registro e gerenciamento de perfis
- **📚 Submissão de Conteúdo**: Estudantes podem submeter resumos, mapas conceituais, exercícios e apresentações
- **👥 Roles de Usuário**: Estudantes e professores com permissões diferenciadas
- **📱 App Mobile**: Interface intuitiva e responsiva
- **🖥️ API REST**: Backend robusto com validação e segurança
- **📸 Fotos de Perfil**: Sistema completo de upload e exibição de fotos
- **🎨 Temas**: Modo claro e escuro

## 🛠️ Tecnologias Utilizadas

### Frontend (Mobile App)
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento e deploy
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **React Context** - Gerenciamento de estado

### Backend (API)
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas
- **Zod** - Validação de schemas

### Banco de Dados
- **MySQL** - Sistema de gerenciamento de banco de dados relacional

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js LTS (versão 18 ou superior)
- MySQL instalado e em execução
- Expo CLI (`npm install -g @expo/cli`)
- Git

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd trilhass/Trilhas-App
```

### 2. Configuração do Backend

#### Instalar dependências
```bash
cd server
npm install
```

#### Configurar variáveis de ambiente
Crie um arquivo `.env` na pasta `server/`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_DATABASE=trilhas
JWT_SECRET=sua_chave_jwt_super_segura
JWT_EXPIRES_IN=7d
```

#### Configurar banco de dados
```bash
# Criar banco de dados
mysql -u root -p
CREATE DATABASE trilhas;

# Executar schema
mysql -u root -p trilhas < schema.sql
```

#### Iniciar o servidor
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### 3. Configuração do Frontend

#### Instalar dependências
```bash
cd app
npm install
```

#### Configurar URL da API
No arquivo `app/app.json`, configure a URL da API:
```json
{
  "expo": {
    "extra": {
      "API_URL": "http://localhost:3000"
    }
  }
}
```

**Importante:**
- **Emulador**: Use `http://localhost:3000`
- **Dispositivo físico**: Use o IP da sua máquina (ex: `http://192.168.1.100:3000`)

#### Iniciar o aplicativo
```bash
npx expo start
```

### 4. Testando o Sistema

1. **Registre um usuário** através da tela de cadastro
2. **Faça login** com as credenciais criadas
3. **Explore as funcionalidades** disponíveis para seu tipo de usuário

## 📁 Estrutura do Projeto

```
Trilhas-App/
├── app/                   # Aplicativo mobile (React Native)
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── config/        # Configurações
│   │   ├── context/       # Contextos React
│   │   └── screens/       # Telas da aplicação
│   ├── assets/           # Recursos estáticos
│   ├── App.js            # Componente principal
│   └── README.md         # Documentação do frontend
├── server/               # API REST (Node.js + TypeScript)
│   ├── src/
│   │   ├── config/       # Configurações
│   │   ├── middleware/    # Middlewares
│   │   ├── models/       # Modelos TypeScript
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Lógica de negócio
│   │   ├── utils/        # Utilitários
│   │   └── validators/   # Validações Zod
│   ├── schema.sql        # Schema do banco
│   └── README.md         # Documentação do backend
└── README.md             # Este arquivo
```

## 🔧 Configurações Importantes

### Backend
- **Porta**: 3000 (configurável via `.env`)
- **Banco**: MySQL na porta 3306
- **JWT**: Tokens com expiração de 7 dias
- **CORS**: Configurado para desenvolvimento

### Frontend
- **Expo**: Configurado para desenvolvimento
- **API**: URL configurável via `app.json`
- **Temas**: Suporte a modo claro/escuro
- **Navegação**: Stack navigation

## 🧪 Testando a API

### Health Check
```bash
curl http://localhost:3000/
```

### Registro de Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "registryId": "123456",
    "password": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com API**
   - Verificar se o backend está rodando
   - Confirmar URL da API no `app.json`
   - Usar IP da máquina em dispositivos físicos

2. **Erro de conexão com MySQL**
   - Verificar se MySQL está rodando
   - Confirmar credenciais no `.env`
   - Executar schema.sql

3. **Problemas de build**
   - Limpar cache: `npx expo r -c`
   - Reinstalar dependências: `rm -rf node_modules && npm install`

## 📚 Documentação Adicional

- **[Frontend](./frontend/README.md)** - Documentação completa do aplicativo mobile
- **[Backend](./backend/README.md)** - Documentação completa da API

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Douglas Roque Machado** - Desenvolvimento completo

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: douglasroqmachado@gmail.com

---

**Versão**: 1.0.0  
**Última atualização**: Novembro 2025
