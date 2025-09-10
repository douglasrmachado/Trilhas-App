# Trilhas – Guia de Execução (Backend e App)

## Tecnologias Utilizadas
- Backend: Node.js, Express, TypeScript, Zod (validação), bcrypt (hash de senha), JSON Web Token (auth), dotenv (env), mysql2 (MySQL)
- Banco de Dados: MySQL (Workbench para gerenciar)
- Mobile: React Native (Expo), React Navigation, Axios

## Estrutura do Projeto
```
Trilhas-Project/
  app/               # aplicativo Expo/React Native
  server/            # API Node/Express + TypeScript
```

---

## Backend (pasta `server/`)

### 1) Variáveis de Ambiente
Crie um arquivo `.env` na pasta `server/` com seu acesso ao MySQL:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_DATABASE=trilhas
JWT_SECRET=uma_chave_segura
```

### 2) Banco de Dados
Crie o schema e a tabela de usuários executando o script `schema.sql` (via MySQL Workbench ou CLI):
```
mysql -u root -p < schema.sql
```

Se você já criou a tabela antes desta alteração, aplique os ajustes:
```
ALTER TABLE users ADD COLUMN matricula VARCHAR(64) NOT NULL UNIQUE AFTER email;
```

### 3) Instalação e Execução
Instale dependências e suba o servidor em modo desenvolvimento:
```
npm install
npm run dev
```

Se tudo estiver correto, você verá:
```
Server running on http://localhost:3000
```

### 4) Endpoints Disponíveis
- POST `/auth/register` – cadastrar usuário `{ name, email, password }`
- POST `/auth/login` – autenticar `{ email, password }` → retorna `{ token, user }`
- POST `/auth/forgot` – simulado, retorna mensagem

---

## App Mobile (pasta `app/`)

### 1) URL da API
No arquivo `app/app.json`, há a chave:
```
"extra": { "API_URL": "http://localhost:3000" }
```
- Em emulador Android no mesmo PC: pode manter `http://localhost:3000`.
- Em celular físico com Expo Go: troque para o IP da sua máquina na mesma rede, por exemplo:
```
"extra": { "API_URL": "http://192.168.0.10:3000" }
```
Após mudar, reinicie o bundler do Expo.

### 2) Instalação e Execução
Dentro da pasta `app/`:
```
npm install
npx expo start
```
No Metro, pressione:
- `a` para abrir no emulador Android, ou
- escaneie o QR Code com o app Expo Go no celular.

### 3) Fluxo de Teste
1. Na tela inicial, toque em “Cadastrar” e crie um usuário.
2. Faça “Login” com o mesmo email/senha.
3. Ao sucesso, você será direcionado para a tela Home.

---

## Dicas
- Se estiver no Android físico, sempre use o IP da máquina (não `localhost`).
- Se o login falhar, verifique o backend (`server`) e o banco MySQL (`schema.sql` aplicado e `.env` correto).



