import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refreshToken(dto: RefreshTokenDto): Promise<{
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<void>;
}
