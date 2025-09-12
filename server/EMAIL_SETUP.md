# 📧 Configuração de Email para Recuperação de Senha

## Configuração do Gmail

### 1. Habilitar App Password
1. Acesse sua conta do Google
2. Vá em **Segurança** → **Verificação em duas etapas**
3. Ative a verificação em duas etapas se não estiver ativa
4. Vá em **Senhas de app** → **Gerar senha de app**
5. Escolha **Email** e **Outro (nome personalizado)**
6. Digite "Trilhas App" como nome
7. **COPIE A SENHA GERADA** (16 caracteres)

### 2. Configurar Variáveis de Ambiente
Adicione ao seu arquivo `.env`:

```env
# Configurações de Email (Gmail)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password_gerada_pelo_google
```

### 3. Testar Configuração
O servidor irá testar automaticamente a conexão com o email ao iniciar.

## Outros Provedores de Email

### Outlook/Hotmail
```env
EMAIL_USER=seu_email@outlook.com
EMAIL_PASS=sua_senha
```

### Yahoo
```env
EMAIL_USER=seu_email@yahoo.com
EMAIL_PASS=sua_app_password_do_yahoo
```

## Fluxo de Recuperação de Senha

1. **Usuário** solicita recuperação na tela "Recuperar Senha"
2. **Sistema** gera código de 6 dígitos
3. **Email** é enviado com o código
4. **Usuário** insere código na tela "Redefinir Senha"
5. **Sistema** valida código e permite nova senha

## Segurança

- ✅ Códigos expiram em 15 minutos
- ✅ Códigos são de uso único
- ✅ Códigos anteriores são invalidados
- ✅ Senhas são hasheadas com bcrypt
- ✅ Validação com Zod

## Troubleshooting

### Erro: "Invalid login"
- Verifique se a App Password está correta
- Confirme se a verificação em duas etapas está ativa

### Erro: "Connection refused"
- Verifique sua conexão com a internet
- Confirme as credenciais do email

### Email não chega
- Verifique a pasta de spam
- Confirme se o email está correto
- Aguarde alguns minutos (pode haver delay)
