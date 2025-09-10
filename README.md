Trilhas-Project

Projeto fullstack com app mobile (Expo/React Native) e API (Node.js/Express + TypeScript).

## Tecnologias
- **App (pasta `app/`)**: Expo, React 19, React Native, React Navigation, Axios
- **API (pasta `server/`)**: Node.js, Express 5, TypeScript, Zod, bcrypt, JSON Web Token, dotenv, mysql2
- **Banco de dados**: MySQL

## Pré-requisitos
- Node.js LTS instalado
- MySQL em execução e acessível
- Conta Expo (opcional, recomendada para testar no dispositivo)

## Como rodar

### 1) Backend (server)
1. Entre na pasta `server/` e instale as dependências:
   ```bash
   cd server
   npm install
   ```
2. Crie um arquivo `.env` em `server/` com suas variáveis (exemplo):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=SUA_SENHA
   DB_DATABASE=trilhas
   JWT_SECRET=uma_chave_segura
   ```
3. Crie o schema/tabelas no MySQL usando `server/schema.sql`.
4. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   A API deverá responder em `http://localhost:3000` (ou na porta configurada).

### 2) App mobile (app)
1. Em outro terminal, entre na pasta `app/` e instale as dependências:
   ```bash
   cd app
   npm install
   ```
2. Configure a URL da API no `app/app.json` em `expo.extra.API_URL`.
   - Emulador Android no mesmo PC: pode usar `http://localhost:3000`.
   - Dispositivo físico: use o IP da sua máquina, ex.: `http://192.168.0.10:3000`.
3. Inicie o bundler do Expo:
   ```bash
   npx expo start
   ```
   No Metro, pressione `a` para abrir no emulador Android ou escaneie o QR Code com o app Expo Go.

## Estrutura
```
Trilhas-Project/
  app/      # aplicativo Expo/React Native
  server/   # API Node/Express + TypeScript
```

## Dicas
- Se o login/registro falhar, verifique se a API está rodando e se o `.env` e o banco MySQL estão corretos.
- Em dispositivo físico, não use `localhost`; use o IP da máquina no `API_URL`.

---

Para detalhes adicionais da API, consulte `server/README.md`.


