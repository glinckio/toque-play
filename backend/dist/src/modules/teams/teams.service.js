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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const storage_service_1 = require("../storage/storage.service");
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;
let TeamsService = class TeamsService {
    prisma;
    storage;
    chatService;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    setChatService(chatService) {
        this.chatService = chatService;
    }
    async create(userId, dto) {
        const team = await this.prisma.team.create({
            data: {
                name: dto.name,
                description: dto.description,
                avatarUrl: dto.avatarUrl,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        isCaptain: true,
                        isGuest: false,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatarUrl: true },
                        },
                    },
                },
            },
        });
        if (this.chatService) {
            await this.chatService.createIntraTeamChat(team.id);
        }
        return team;
    }
    async findAll(userId) {
        return this.prisma.team.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                _count: { select: { members: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async search(query, userId) {
        if (!query || query.trim().length === 0)
            return [];
        const pattern = `%${query}%`;
        return this.prisma.$queryRaw `
      SELECT id, name, "avatarUrl", sport,
        (SELECT COUNT(*) FROM "TeamMember" tm WHERE tm."teamId" = "Team".id)::int AS "memberCount"
      FROM "Team"
      WHERE "ownerId" != ${userId}
        AND (unaccent(name) ILIKE unaccent(${pattern})
          OR unaccent(COALESCE(description, '')) ILIKE unaccent(${pattern}))
      ORDER BY name ASC
      LIMIT 20
    `.then((rows) => rows.map((r) => ({
            id: r.id,
            name: r.name,
            avatarUrl: r.avatarUrl,
            sport: r.sport,
            _count: { members: r.memberCount },
        })));
    }
    async findOne(teamId, userId) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            include: {
                owner: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatarUrl: true },
                        },
                    },
                    orderBy: [{ isCaptain: 'desc' }, { id: 'asc' }],
                },
            },
        });
        if (!team) {
            throw app_error_1.AppError.teamNotFound();
        }
        const isMember = team.members.some((m) => m.userId === userId);
        if (team.ownerId !== userId && !isMember) {
            throw app_error_1.AppError.teamNotFound();
        }
        return team;
    }
    async update(teamId, userId, dto) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team) {
            throw app_error_1.AppError.teamNotFound();
        }
        if (team.ownerId !== userId) {
            throw app_error_1.AppError.notTeamOwner();
        }
        return this.prisma.team.update({
            where: { id: teamId },
            data: dto,
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatarUrl: true },
                        },
                    },
                },
            },
        });
    }
    async remove(teamId, userId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team) {
            throw app_error_1.AppError.teamNotFound();
        }
        if (team.ownerId !== userId) {
            throw app_error_1.AppError.notTeamOwner();
        }
        await this.prisma.team.delete({ where: { id: teamId } });
    }
    async uploadAvatar(teamId, userId, file) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw app_error_1.AppError.teamNotFound();
        if (team.ownerId !== userId)
            throw app_error_1.AppError.notTeamOwner();
        if (!ALLOWED_MIMES.includes(file.mimetype))
            throw app_error_1.AppError.invalidFileType();
        if (file.size > MAX_SIZE)
            throw app_error_1.AppError.fileTooLarge();
        if (team.avatarUrl) {
            const oldKey = this.storage.extractKeyFromUrl(team.avatarUrl);
            if (oldKey)
                await this.storage.deleteFile(oldKey);
        }
        const ext = file.originalname.split('.').pop() ?? 'jpg';
        const key = `teams/${teamId}/avatar-${Date.now()}.${ext}`;
        const avatarUrl = await this.storage.uploadFile(file.buffer, key, file.mimetype);
        return this.prisma.team.update({
            where: { id: teamId },
            data: { avatarUrl },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
                    },
                },
            },
        });
    }
    async verifyOwnership(teamId, userId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team) {
            throw app_error_1.AppError.teamNotFound();
        }
        if (team.ownerId !== userId) {
            throw app_error_1.AppError.notTeamOwner();
        }
        return team;
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map