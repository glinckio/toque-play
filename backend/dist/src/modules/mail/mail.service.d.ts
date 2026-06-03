import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private resend;
    private fromEmail;
    private readonly logger;
    constructor(configService: ConfigService);
    sendVerificationEmail(to: string, code: string, userName: string): Promise<void>;
    sendPasswordResetEmail(to: string, code: string, userName: string): Promise<void>;
    private buildVerificationTemplate;
    private buildResetTemplate;
}
