import nodemailer from 'nodemailer';

// Configuração do transporter de email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Você pode usar outros serviços como 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '', // Use App Password para Gmail
  },
});

export async function sendPasswordResetCode(email: string, code: string, userName: string) {
  // Se não há configuração de email, apenas loga o código (modo desenvolvimento)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`🔐 CÓDIGO DE RECUPERAÇÃO PARA ${email}:`);
    console.log(`👤 Usuário: ${userName}`);
    console.log(`🔢 Código: ${code}`);
    console.log(`⏰ Expira em: 15 minutos`);
    console.log('📧 Email não enviado - configure EMAIL_USER e EMAIL_PASS no .env');
    return true; // Retorna true para não quebrar o fluxo
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@trilhas.com',
    to: email,
    subject: 'Código de Recuperação de Senha - Trilhas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e90ff; margin: 0;">Trilhas</h1>
          <p style="color: #666; margin: 5px 0;">Criando caminhos para o futuro</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Recuperação de Senha</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Olá <strong>${userName}</strong>,
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Você solicitou a recuperação de senha para sua conta no Trilhas. 
            Use o código abaixo para redefinir sua senha:
          </p>
          
          <div style="background-color: #1e90ff; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Importante:</strong>
          </p>
          <ul style="color: #666; font-size: 14px;">
            <li>Este código expira em 15 minutos</li>
            <li>Use apenas uma vez</li>
            <li>Se você não solicitou esta recuperação, ignore este email</li>
          </ul>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>Este é um email automático, não responda.</p>
          <p>© 2024 Trilhas - Todos os direitos reservados</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Código de recuperação enviado para: ${email}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

export async function testEmailConnection() {
  // Se não há configuração de email, não testa
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email não configurado - modo desenvolvimento');
    console.log('💡 Configure EMAIL_USER e EMAIL_PASS no .env para enviar emails');
    return true;
  }

  try {
    await transporter.verify();
    console.log('✅ Conexão com servidor de email configurada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração do email:', error);
    return false;
  }
}
