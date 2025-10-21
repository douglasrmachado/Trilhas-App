# 📱 Guia para Gerar APK do Trilhas

## ✅ Pré-requisitos
- Node.js instalado
- Conta Expo (criar em expo.dev se não tiver)
- EAS CLI instalado (já está instalado!)

---

## 🚀 Método Recomendado: EAS Build (Mais Fácil)

### Passo 1: Fazer Login no EAS
```bash
cd frontend
eas login
```

Digite seu email e senha do Expo (ou crie uma conta gratuita).

### Passo 2: Configurar o Projeto
```bash
eas build:configure
```

Quando perguntar:
- **"Would you like to automatically create an EAS project?"** → Digite `Y` e pressione Enter

### Passo 3: Gerar o APK
```bash
eas build --platform android --profile preview
```

**O que vai acontecer:**
1. O EAS vai configurar o projeto
2. Vai fazer upload do código
3. Vai compilar o APK na nuvem (10-20 minutos)
4. Ao final, você receberá um **link para baixar o APK**

**Exemplo de saída:**
```
✔ Build finished
📱 Install the build on your device:
https://expo.dev/artifacts/eas/abc123.apk
```

### Passo 4: Baixar e Instalar
1. Abra o link no seu celular
2. Baixe o APK
3. Instale no celular (pode precisar permitir "Fontes Desconhecidas")

---

## 🔧 Método Alternativo: Build Local

Se preferir gerar o APK localmente (precisa de Android Studio):

### Passo 1: Preparar o Projeto
```bash
cd frontend
npx expo prebuild
```

### Passo 2: Gerar APK
```bash
cd android
./gradlew assembleRelease
```

### Passo 3: Encontrar o APK
O APK estará em:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📝 Notas Importantes

### ✅ Configurações já feitas:
- ✅ API URL configurada para: `http://douglas-trilhas.tecnomaub.site`
- ✅ Package name: `com.douglasrmachado.trilhas`
- ✅ App name: `Trilhas`
- ✅ Versão: `1.0.0`
- ✅ Permissões configuradas (Internet, Storage)

### 🔒 Para Build de Produção (Play Store):
Se quiser publicar na Play Store futuramente, use:
```bash
eas build --platform android --profile production
```

Isso vai gerar um AAB (Android App Bundle) assinado.

### 🐛 Problemas Comuns:

**Erro: "Invalid UUID"**
- Já corrigido! O app.json foi atualizado.

**Erro: "Network Error"**
- Verifique se o servidor está no ar: http://douglas-trilhas.tecnomaub.site

**Erro: "Login failed"**
- Crie uma conta gratuita em expo.dev

---

## 📞 Comandos Úteis

### Ver status do build:
```bash
eas build:list
```

### Cancelar um build:
```bash
eas build:cancel
```

### Ver logs do build:
```bash
eas build:view
```

---

## 🎯 Resumo Rápido

**Para gerar o APK agora:**

1. Abra o terminal na pasta `frontend`
2. Execute: `eas login` (faça login ou crie conta)
3. Execute: `eas build:configure` (responda Y)
4. Execute: `eas build --platform android --profile preview`
5. Aguarde 10-20 minutos
6. Baixe o APK pelo link fornecido

**Pronto! 🎉**

