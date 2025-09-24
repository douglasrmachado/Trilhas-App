# Sistema de Foto de Perfil - Trilhas App

## 📸 Funcionalidade Implementada

O sistema agora suporta persistência de foto de perfil do usuário, que é mantida tanto no banco de dados quanto no dispositivo local.

## 🏗️ Arquitetura

### Backend (Servidor)
- **Campo no banco**: `profile_photo` (TEXT) na tabela `users`
- **Endpoint**: `PUT /auth/profile-photo`
- **Autenticação**: Requer token JWT válido
- **Persistência**: Salva no banco de dados MySQL

### Frontend (App)
- **Armazenamento local**: AsyncStorage para cache
- **Sincronização**: Atualiza servidor e local simultaneamente
- **Fallback**: Ícone padrão quando não há foto

## 🔧 Como Usar

### 1. Atualizar Foto de Perfil
```javascript
import { useAuth } from '../context/AuthContext';

const { updateProfilePhoto } = useAuth();

// Exemplo de uso
try {
  await updateProfilePhoto('data:image/jpeg;base64,/9j/4AAQ...');
  console.log('Foto atualizada com sucesso!');
} catch (error) {
  console.error('Erro ao atualizar foto:', error);
}
```

### 2. Exibir Foto de Perfil
```javascript
const { user } = useAuth();

// No componente
{user?.profile_photo ? (
  <Image source={{ uri: user.profile_photo }} style={styles.profileImage} />
) : (
  <Text>👤</Text>
)}
```

## 🗄️ Banco de Dados

### Migração Executada
```sql
ALTER TABLE users ADD COLUMN profile_photo TEXT NULL AFTER role;
```

### Estrutura da Tabela
```sql
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  matricula VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','professor') NOT NULL DEFAULT 'student',
  profile_photo TEXT NULL,  -- ← NOVO CAMPO
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

## 🔄 Fluxo de Funcionamento

### Login
1. Usuário faz login
2. Servidor retorna dados incluindo `profile_photo`
3. Frontend salva dados no AsyncStorage
4. Foto é exibida se existir

### Atualização de Foto
1. Usuário seleciona nova foto
2. Frontend chama `updateProfilePhoto(photoUri)`
3. Requisição é enviada para `PUT /auth/profile-photo`
4. Servidor atualiza banco de dados
5. Frontend atualiza AsyncStorage
6. Interface é atualizada imediatamente

### Logout/Login
1. Usuário faz logout
2. AsyncStorage é limpo
3. Usuário faz login novamente
4. Servidor retorna dados atualizados incluindo foto
5. Foto é restaurada do servidor

## 🛡️ Segurança

- **Autenticação**: Endpoint protegido por JWT
- **Validação**: Verificação de usuário autenticado
- **Sanitização**: Validação de URL da foto
- **Autorização**: Apenas o próprio usuário pode atualizar sua foto

## 📱 Compatibilidade

- **Formato**: Suporta URLs de imagem (base64, HTTP, etc.)
- **Tamanho**: Recomendado até 2MB
- **Formatos**: JPEG, PNG, WebP
- **Fallback**: Ícone padrão para usuários sem foto

## 🔍 Debugging

### Logs do Servidor
```
📸 Atualizando foto de perfil: { userId: 123, photoUri: 'data:image/...' }
✅ Foto de perfil atualizada com sucesso
```

### Logs do Frontend
```
📸 Foto de perfil atualizada no servidor e localmente
🔄 AuthContext estado mudou: { token: true, user: { profile_photo: '...' } }
```

## 🚀 Benefícios

- ✅ **Persistência**: Foto não é perdida entre sessões
- ✅ **Sincronização**: Servidor e local sempre atualizados
- ✅ **Performance**: Cache local para carregamento rápido
- ✅ **Segurança**: Autenticação e validação adequadas
- ✅ **UX**: Atualização imediata da interface

## 📋 Próximos Passos

1. **Upload de arquivo**: Implementar seleção de foto da galeria
2. **Redimensionamento**: Otimizar tamanho das imagens
3. **CDN**: Armazenar fotos em serviço de nuvem
4. **Cache**: Implementar cache inteligente
5. **Compressão**: Reduzir tamanho das imagens automaticamente

---

**Status**: ✅ Implementado e funcionando  
**Versão**: 1.0.0  
**Data**: Dezembro 2024
