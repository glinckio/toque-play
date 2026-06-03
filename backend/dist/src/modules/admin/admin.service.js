"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const redis_service_1 = require("../../common/redis/redis.service");
const app_error_1 = require("../../common/errors/app-error");
const DASHBOARD_CACHE_KEY = 'admin:dashboard';
const DASHBOARD_CACHE_TTL = 300;
const MAINTENANCE_KEY = 'system:maintenance';
const GLOBAL_MESSAGE_KEY = 'system:globalMessage';
let AdminService = class AdminService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getDashboard() {
        const cached = await this.redis.get(DASHBOARD_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [totalUsers, activeUsers, tournamentsByStatus, totalMatches, totalTeams,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: { refreshTokens: { some: { createdAt: { gte: thirtyDaysAgo } } } },
            }),
            this.prisma.tournament.groupBy({ by: ['status'], _count: { status: true } }),
            this.prisma.match.count(),
            this.prisma.team.count(),
        ]);
        const tournamentsCount = {};
        for (const row of tournamentsByStatus) {
            tournamentsCount[row.status] = row._count.status;
        }
        const result = {
            totalUsers,
            activeUsersLast30d: activeUsers,
            tournamentsByStatus: tournamentsCount,
            totalMatches,
            totalTeams,
        };
        await this.redis.set(DASHBOARD_CACHE_KEY, JSON.stringify(result), DASHBOARD_CACHE_TTL);
        return result;
    }
    async listUsers(query) {
        const { page = 1, limit = 20, search } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    avatarUrl: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async blockUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw app_error_1.AppError.userNotFound();
        if (user.status === 'BLOCKED')
            throw app_error_1.AppError.userAlreadyBlocked();
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: { status: 'BLOCKED' },
            }),
            this.prisma.refreshToken.deleteMany({ where: { userId } }),
        ]);
        return { id: userId, status: 'BLOCKED' };
    }
    async unblockUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw app_error_1.AppError.userNotFound();
        if (user.status === 'ACTIVE')
            throw app_error_1.AppError.userAlreadyActive();
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'ACTIVE' },
            select: { id: true, name: true, email: true, status: true },
        });
    }
    async listTournaments(query) {
        const { page = 1, limit = 20, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        const [tournaments, total] = await Promise.all([
            this.prisma.tournament.findMany({
                where,
                include: {
                    owner: { select: { id: true, name: true, email: true } },
                    _count: { select: { registrations: true, brackets: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.tournament.count({ where }),
        ]);
        return { data: tournaments, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async blockTournament(tournamentId) {
        const tournament = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });
        if (!tournament)
            throw app_error_1.AppError.tournamentNotFound();
        if (tournament.status === 'CANCELLED')
            throw app_error_1.AppError.tournamentAlreadyDeleted();
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: 'CANCELLED', isPublished: false },
            select: { id: true, name: true, status: true },
        });
    }
    async deleteTournament(tournamentId) {
        const tournament = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });
        if (!tournament)
            throw app_error_1.AppError.tournamentNotFound();
        if (tournament.status === 'CANCELLED')
            throw app_error_1.AppError.tournamentAlreadyDeleted();
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: 'CANCELLED', isPublished: false },
            select: { id: true, name: true, status: true },
        });
    }
    async getLogs(query) {
        const { level, source, from, to } = query;
        const where = {};
        if (level)
            where.level = level;
        if (source)
            where.source = source;
        if (from || to) {
            where.createdAt = {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
            };
        }
        return this.prisma.adminLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async getMonitoring() {
        const [activeMatches, onlineUsers] = await Promise.all([
            this.prisma.match.count({ where: { status: 'IN_PROGRESS' } }),
            this.prisma.refreshToken.findMany({
                where: { expiresAt: { gt: new Date() } },
                select: { userId: true },
                distinct: ['userId'],
            }),
        ]);
        const wsConnections = await this.redis.get('monitoring:ws_connections');
        const wsCount = wsConnections ? parseInt(wsConnections, 10) : 0;
        return {
            activeMatches,
            onlineUsers: onlineUsers.length,
            webSocketConnections: wsCount,
        };
    }
    async getSystem() {
        const [maintenanceFlag, globalMessage] = await Promise.all([
            this.redis.get(MAINTENANCE_KEY),
            this.redis.get(GLOBAL_MESSAGE_KEY),
        ]);
        return {
            maintenanceMode: maintenanceFlag === 'true',
            globalMessage: globalMessage ?? null,
            version: process.env.npm_package_version ?? '1.0.0',
        };
    }
    async updateSystem(dto) {
        if (dto.maintenanceMode !== undefined) {
            if (dto.maintenanceMode) {
                await this.redis.set(MAINTENANCE_KEY, 'true');
            }
            else {
                await this.redis.del(MAINTENANCE_KEY);
            }
        }
        if (dto.globalMessage !== undefined) {
            if (dto.globalMessage) {
                await this.redis.set(GLOBAL_MESSAGE_KEY, dto.globalMessage);
            }
            else {
                await this.redis.del(GLOBAL_MESSAGE_KEY);
            }
        }
        return this.getSystem();
    }
    async getMetrics(query) {
        const { from, to } = query;
        const dateFilter = {};
        if (from || to) {
            dateFilter.createdAt = {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
            };
        }
        const [totalUsers, newUsers, totalTournaments, totalMatches, totalRegistrations,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: dateFilter }),
            this.prisma.tournament.count({ where: dateFilter }),
            this.prisma.match.count({ where: dateFilter.createdAt ? { scheduledAt: dateFilter.createdAt } : {} }),
            this.prisma.registration.count({ where: dateFilter }),
        ]);
        return {
            totalUsers,
            newUsersInPeriod: newUsers,
            totalTournaments,
            totalMatches,
            totalRegistrations,
            period: { from: from ?? null, to: to ?? null },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AdminService);
//# sourceMappingURL=admin.service.js.map