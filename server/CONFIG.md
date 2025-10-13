# 🔧 Configuração do Servidor

## Passo 1: Criar arquivo .env

Crie um arquivo chamado `.env` na pasta `server/` com o seguinte conteúdo:

```env
# Configuração do Servidor
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Configuração do Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_DATABASE=trilhas

# Configuração JWT (Autenticação)
JWT_SECRET=trilhas_jwt_secret_super_seguro_altere_isso
JWT_EXPIRES_IN=7d

# Configuração do Admin Inicial (Opcional)
# Será criado automaticamente na primeira execução
ADMIN_EMAIL=admin@trilhas.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Professor Admin
ADMIN_REGISTRY=PROF-0001
```

## Passo 2: Configurar Banco de Dados

### Opção A - MySQL Workbench (Recomendado)
1. Abra o MySQL Workbench
2. Conecte ao servidor local
3. Abra o arquivo `setup-database.sql`
4. Execute o script (botão ⚡ ou Ctrl+Shift+Enter)

### Opção B - Prompt de Comando do Windows
1. Abra o Prompt de Comando (cmd)
2. Execute:
```cmd
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -p
```
3. Digite sua senha
4. Execute:
```sql
source C:/Users/Douglas/Documents/Trilhass/Trilhas-App/server/setup-database.sql
```

### Opção C - Copiar e Colar SQL
Se preferir, abra `setup-database.sql` e copie/cole o conteúdo no MySQL Workbench ou MySQL Command Line.

## Passo 3: Iniciar o Servidor

```bash
npm run dev
```

## ✅ Verificação

O servidor irá:
1. ✅ Conectar ao banco de dados
2. ✅ Criar tabelas automaticamente (submissions, notifications)
3. ✅ Criar usuário admin inicial
4. ✅ Ficar pronto em http://localhost:3000

## 🚨 Troubleshooting

### Erro: "Access denied for user 'root'@'localhost'"
- Verifique a senha no arquivo `.env`
- Confirme que o MySQL está rodando

### Erro: "Unknown database 'trilhas'"
- Execute o arquivo `setup-database.sql` primeiro

### Erro: "Cannot find module"
- Execute `npm install` na pasta server

