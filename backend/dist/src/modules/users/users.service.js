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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const DEFAULT_NOTIFICATION_PREFS = {
    messages: true,
    invites: true,
    matches: true,
    friendlies: true,
    tournaments: true,
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                phone: true,
                bio: true,
                isFirstAccess: true,
                notificationPreferences: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...dto,
                phone: dto.phone === '' ? null : dto.phone,
                bio: dto.bio === '' ? null : dto.bio,
                isFirstAccess: false,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                phone: true,
                bio: true,
                isFirstAccess: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updated;
    }
    async updateLocation(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                latitude: data.latitude,
                longitude: data.longitude,
                ...(data.enableLocationNotifications !== undefined && {
                    enableLocationNotifications: data.enableLocationNotifications,
                }),
            },
            select: {
                id: true,
                latitude: true,
                longitude: true,
                enableLocationNotifications: true,
            },
        });
    }
    async getNotificationPreferences(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { notificationPreferences: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { ...DEFAULT_NOTIFICATION_PREFS, ...(user.notificationPreferences || {}) };
    }
    async updateNotificationPreferences(userId, dto) {
        const current = await this.getNotificationPreferences(userId);
        const updated = { ...current, ...dto };
        await this.prisma.user.update({
            where: { id: userId },
            data: { notificationPreferences: updated },
        });
        return updated;
    }
    async shouldNotify(userId, category) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { notificationPreferences: true },
        });
        if (!user)
            return false;
        const prefs = { ...DEFAULT_NOTIFICATION_PREFS, ...(user.notificationPreferences || {}) };
        return prefs[category] !== false;
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, avatarUrl: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const stats = await this.prisma.athleteStats.findMany({
            where: { userId },
            include: {
                team: { select: { id: true, name: true, avatarUrl: true } },
                tournament: {
                    select: {
                        id: true,
                        name: true,
                        stages: { select: { date: true }, orderBy: { date: 'asc' } },
                        _count: { select: { registrations: true } },
                    },
                },
            },
        });
        const totals = stats.reduce((acc, s) => ({
            matchesPlayed: acc.matchesPlayed + s.matchesPlayed,
            matchesWon: acc.matchesWon + s.matchesWon,
            setsWon: acc.setsWon + s.setsWon,
            pointsScored: acc.pointsScored + s.pointsScored,
            mvpCount: acc.mvpCount + s.mvpCount,
        }), { matchesPlayed: 0, matchesWon: 0, setsWon: 0, pointsScored: 0, mvpCount: 0 });
        return {
            user,
            totals: {
                ...totals,
                winRate: totals.matchesPlayed > 0
                    ? Math.round((totals.matchesWon / totals.matchesPlayed) * 100)
                    : 0,
            },
            byTournament: stats.map((s) => ({
                tournament: s.tournament,
                team: s.team,
                matchesPlayed: s.matchesPlayed,
                matchesWon: s.matchesWon,
                setsWon: s.setsWon,
                pointsScored: s.pointsScored,
                mvpCount: s.mvpCount,
            })),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map