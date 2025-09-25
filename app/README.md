# 📱 Trilhas App - Frontend

## 🎯 Visão Geral

O Trilhas App é um aplicativo mobile desenvolvido em React Native com Expo, focado na criação de uma plataforma educacional onde estudantes podem compartilhar conhecimento através de submissões de conteúdo.

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento e deploy
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP para comunicação com API
- **AsyncStorage** - Armazenamento local de dados
- **React Context** - Gerenciamento de estado global
- **Expo Document Picker** - Seleção de arquivos

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── OptimizedImage.jsx
│   │   └── PasswordInput.jsx
│   ├── config/             # Configurações
│   │   └── api.js
│   ├── context/            # Contextos React
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   └── screens/            # Telas da aplicação
│       ├── HomeScreen.jsx
│       ├── LoginScreen.jsx
│       ├── RegisterScreen.jsx
│       ├── ProfileScreen.jsx
│       ├── SubmitContentScreen.jsx
│       ├── MySubmissionsScreen.jsx
│       ├── ProfessorHomeScreen.jsx
│       └── ...
├── assets/                 # Recursos estáticos
├── App.js                  # Componente principal
├── app.json               # Configuração do Expo
└── package.json           # Dependências
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js LTS instalado
- Expo CLI (`npm install -g @expo/cli`)
- App Expo Go no dispositivo móvel (opcional)

### Instalação
```bash
cd app
npm install
```

### Execução
```bash
npx expo start
```

### Opções de Teste
- **Emulador Android**: Pressione `a` no terminal
- **Dispositivo físico**: Escaneie o QR Code com Expo Go
- **Web**: Pressione `w` no terminal

## ⚙️ Configuração

### URL da API
Configure a URL da API no arquivo `app.json`:

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

## 🎨 Funcionalidades Principais

### 🔐 Autenticação
- **Login**: Autenticação com email e senha
- **Registro**: Cadastro de novos usuários
- **Perfil**: Gerenciamento de dados pessoais
- **Foto de perfil**: Upload e exibição de foto

### 📚 Sistema de Conteúdo
- **Submissão**: Estudantes podem submeter conteúdo educacional
- **Tipos suportados**: Resumos, mapas conceituais, exercícios, apresentações
- **Upload de arquivos**: Suporte a PDFs até 10MB
- **Categorização**: Por matéria e ano/série

### 👥 Roles de Usuário
- **Estudante**: Pode submeter e visualizar conteúdo
- **Professor**: Pode aprovar/rejeitar submissões e criar outros professores

### 🎨 Interface
- **Tema claro/escuro**: Alternância automática
- **Design responsivo**: Adaptado para diferentes tamanhos de tela
- **Navegação intuitiva**: Stack navigation com botões de voltar
- **Componentes otimizados**: Performance melhorada com React.memo

## 🔧 Componentes Principais

### AuthContext
Gerencia o estado de autenticação global:
- Login/logout
- Persistência de dados
- Atualização de perfil

### ThemeContext
Controla o tema da aplicação:
- Modo claro/escuro
- Cores personalizadas
- Persistência da preferência

### OptimizedImage
Componente otimizado para exibição de imagens:
- Loading state
- Error handling
- Fallback para imagens quebradas

## 📱 Telas da Aplicação

### Autenticação
- **LoginScreen**: Tela de login
- **RegisterScreen**: Tela de cadastro

### Principal
- **HomeScreen**: Tela inicial para estudantes
- **ProfessorHomeScreen**: Tela inicial para professores

### Conteúdo
- **SubmitContentScreen**: Submissão de conteúdo
- **MySubmissionsScreen**: Minhas submissões
- **SubmissionDetailScreen**: Detalhes da submissão

### Perfil
- **ProfileScreen**: Gerenciamento de perfil
- **CampusInfoScreen**: Informações do campus
- **ContactScreen**: Contato

## 🎯 Otimizações Implementadas

### Performance
- **React.memo**: Evita re-renders desnecessários
- **useCallback**: Otimiza funções de callback
- **useMemo**: Memoiza valores computados
- **FlatList otimizada**: Configurações de performance

### UX/UI
- **Loading states**: Indicadores de carregamento
- **Error handling**: Tratamento de erros amigável
- **Validação em tempo real**: Feedback imediato
- **Navegação fluida**: Transições suaves

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros
- **Validação de entrada**: Sanitização de dados
- **Armazenamento seguro**: AsyncStorage para dados sensíveis
- **CORS configurado**: Comunicação segura com API

## 📊 Monitoramento

### Logs de Debug
```javascript
// Habilitar logs detalhados
console.log('Auth state:', authState);
console.log('API response:', response.data);
```

### Performance
- Monitoramento de re-renders
- Tempo de carregamento de telas
- Uso de memória

## 🚀 Deploy

### Build para Produção
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

### Configurações de Produção
- Atualizar `API_URL` para URL de produção
- Configurar variáveis de ambiente
- Testar em dispositivos reais

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com API**
   - Verificar se o backend está rodando
   - Confirmar URL da API no `app.json`
   - Usar IP da máquina em dispositivos físicos

2. **Problemas de navegação**
   - Verificar configuração do React Navigation
   - Confirmar que todas as telas estão registradas

3. **Erro de build**
   - Limpar cache: `npx expo r -c`
   - Reinstalar dependências: `rm -rf node_modules && npm install`

## 📈 Próximas Melhorias

- [ ] Sistema de notificações push
- [ ] Cache offline inteligente
- [ ] Compressão automática de imagens
- [ ] Modo offline para funcionalidades básicas
- [ ] Analytics de uso
- [ ] Testes automatizados

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024
