import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../../common/redis/redis.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private mailService;
    private redisService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, mailService: MailService, redisService: RedisService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            isFirstAccess: boolean;
            isEmailVerified: boolean;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    resendCode(dto: ResendCodeDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            isFirstAccess: boolean;
            isEmailVerified: true;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    loginWithGoogle(dto: GoogleAuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            isFirstAccess: boolean;
            isEmailVerified: boolean;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            isFirstAccess: boolean;
            isEmailVerified: boolean;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    logout(userId: string): Promise<void>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        message: string;
    }>;
    private createVerificationCode;
    private verifyGoogleToken;
    private generateTokens;
}
