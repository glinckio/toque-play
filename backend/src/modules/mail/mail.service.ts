import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private fromEmail: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.fromEmail =
      this.configService.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';
  }

  async sendVerificationEmail(
    to: string,
    code: string,
    userName: string,
  ): Promise<void> {
    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.warn(`[DEV] Verification code for ${to}: ${code}`);
      return;
    }

    const html = this.buildVerificationTemplate(code, userName);

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: 'ToquePlay - Seu codigo de verificacao',
      html,
    });

    if (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    this.logger.log(`Verification email sent to ${to}`);
  }

  async sendPasswordResetEmail(
    to: string,
    code: string,
    userName: string,
  ): Promise<void> {
    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.warn(`[DEV] Password reset code for ${to}: ${code}`);
      return;
    }

    const html = this.buildResetTemplate(code, userName);

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: 'ToquePlay - Redefinir senha',
      html,
    });

    if (error) {
      this.logger.error(`Failed to send reset email to ${to}: ${error.message}`);
      throw new Error(`Failed to send reset email: ${error.message}`);
    }

    this.logger.log(`Password reset email sent to ${to}`);
  }

  private buildVerificationTemplate(code: string, userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #D14F5C; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">ToquePlay</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #18181b; font-size: 20px;">Ola, ${userName}!</h2>
              <p style="margin: 0 0 24px; color: #71717a; font-size: 15px;">Use o codigo abaixo para verificar seu email:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #f4f4f5; border-radius: 8px; padding: 20px;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #D14F5C;">${code}</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #71717a; font-size: 13px;">Este codigo expira em <strong>10 minutos</strong>.</p>
              <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 12px;">Se voce nao criou uma conta no ToquePlay, ignore este email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private buildResetTemplate(code: string, userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #D14F5C; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">ToquePlay</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #18181b; font-size: 20px;">Ola, ${userName}!</h2>
              <p style="margin: 0 0 24px; color: #71717a; font-size: 15px;">Use o codigo abaixo para redefinir sua senha:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #f4f4f5; border-radius: 8px; padding: 20px;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #D14F5C;">${code}</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #71717a; font-size: 13px;">Este codigo expira em <strong>15 minutos</strong>.</p>
              <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 12px;">Se voce nao solicitou a redefinicao, ignore este email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}
