"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const redis_service_1 = require("../../common/redis/redis.service");
const google_auth_library_1 = require("google-auth-library");
const app_error_1 = require("../../common/errors/app-error");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    mailService;
    redisService;
    googleClient;
    constructor(prisma, jwtService, configService, mailService, redisService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
        this.redisService = redisService;
        this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw app_error_1.AppError.emailAlreadyExists();
        }
        if (dto.password !== dto.confirmPassword) {
            throw app_error_1.AppError.passwordsDoNotMatch();
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
                isFirstAccess: true,
                isEmailVerified: false,
            },
        });
        const plainCode = await this.createVerificationCode(user.id);
        await this.mailService.sendVerificationEmail(user.email, plainCode, user.name);
        return { message: 'Registro realizado. Verifique seu email.' };
    }
    async verifyEmail(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw app_error_1.AppError.userNotFound();
        }
        if (user.isEmailVerified) {
            throw app_error_1.AppError.emailAlreadyVerified();
        }
        const verification = await this.prisma.emailVerification.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!verification) {
            throw app_error_1.AppError.invalidOrExpiredCode();
        }
        const isValid = await bcrypt.compare(dto.code, verification.code);
        if (!isValid) {
            throw app_error_1.AppError.invalidOrExpiredCode();
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true },
        });
        await this.prisma.emailVerification.deleteMany({
            where: { userId: user.id },
        });
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                isFirstAccess: user.isFirstAccess,
                isEmailVerified: true,
                role: user.role,
            },
        };
    }
    async resendCode(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw app_error_1.AppError.userNotFound();
        }
        if (user.isEmailVerified) {
            throw app_error_1.AppError.emailAlreadyVerified();
        }
        const latestCode = await this.prisma.emailVerification.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });
        if (latestCode) {
            const cooldown = new Date(latestCode.createdAt.getTime() + 60_000);
            if (new Date() < cooldown) {
                throw app_error_1.AppError.codeResendCooldown();
            }
        }
        await this.prisma.emailVerification.deleteMany({
            where: { userId: user.id },
        });
        const plainCode = await this.createVerificationCode(user.id);
        await this.mailService.sendVerificationEmail(user.email, plainCode, user.name);
        return { message: 'Codigo reenviado com sucesso' };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw app_error_1.AppError.emailNotFound();
        }
        if (!user.password) {
            throw app_error_1.AppError.emailNotFound();
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw app_error_1.AppError.invalidPassword();
        }
        if (!user.isEmailVerified) {
            throw app_error_1.AppError.emailNotVerified();
        }
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                isFirstAccess: user.isFirstAccess,
                isEmailVerified: user.isEmailVerified,
                role: user.role,
            },
        };
    }
    async loginWithGoogle(dto) {
        const googleUser = await this.verifyGoogleToken(dto.token);
        let user = await this.prisma.user.findUnique({
            where: { googleId: googleUser.sub },
        });
        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
            });
            if (user) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: googleUser.sub, isEmailVerified: true },
                });
            }
            else {
                user = await this.prisma.user.create({
                    data: {
                        email: googleUser.email,
                        name: googleUser.name || googleUser.email.split('@')[0],
                        avatarUrl: googleUser.picture || null,
                        googleId: googleUser.sub,
                        isFirstAccess: true,
                        isEmailVerified: true,
                    },
                });
            }
        }
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                isFirstAccess: user.isFirstAccess,
                isEmailVerified: user.isEmailVerified,
                role: user.role,
            },
        };
    }
    async refreshToken(refreshToken) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!stored || stored.expiresAt < new Date()) {
            throw app_error_1.AppError.invalidRefreshToken();
        }
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        const { accessToken, refreshToken: newRefreshToken, } = await this.generateTokens(stored.user.id, stored.user.email, stored.user.role);
        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: stored.user.id,
                email: stored.user.email,
                name: stored.user.name,
                avatarUrl: stored.user.avatarUrl,
                isFirstAccess: stored.user.isFirstAccess,
                isEmailVerified: stored.user.isEmailVerified,
                role: stored.user.role,
            },
        };
    }
    async logout(userId) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return { message: 'Se o email existir, voce recebera o codigo de redefinicao.' };
        }
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const redisKey = `reset:${email}`;
        await this.redisService.set(redisKey, code, 15 * 60);
        await this.mailService.sendPasswordResetEmail(email, code, user.name);
        return { message: 'Se o email existir, voce recebera o codigo de redefinicao.' };
    }
    async resetPassword(email, code, newPassword) {
        const redisKey = `reset:${email}`;
        const storedCode = await this.redisService.get(redisKey);
        if (!storedCode) {
            throw app_error_1.AppError.resetTokenExpired();
        }
        if (storedCode !== code) {
            throw app_error_1.AppError.resetTokenInvalid();
        }
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw app_error_1.AppError.userNotFound();
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        await this.redisService.del(redisKey);
        await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        return { message: 'Senha redefinida com sucesso.' };
    }
    async createVerificationCode(userId) {
        const plainCode = String(Math.floor(100000 + Math.random() * 900000));
        const hashedCode = await bcrypt.hash(plainCode, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.emailVerification.create({
            data: {
                code: hashedCode,
                userId,
                expiresAt,
            },
        });
        return plainCode;
    }
    async verifyGoogleToken(token) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw app_error_1.AppError.invalidGoogleToken();
            }
            return payload;
        }
        catch {
            throw app_error_1.AppError.invalidGoogleToken();
        }
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map