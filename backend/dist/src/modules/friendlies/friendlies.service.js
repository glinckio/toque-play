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
exports.FriendliesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const notification_service_1 = require("../../common/services/notification.service");
const client_1 = require("@prisma/client");
const FRIENDLY_INCLUDE = {
    requester: { select: { id: true, name: true, avatarUrl: true } },
    requesterTeam: { select: { id: true, name: true, avatarUrl: true } },
    challenged: { select: { id: true, name: true, avatarUrl: true } },
    challengedTeam: { select: { id: true, name: true, avatarUrl: true } },
    match: {
        include: {
            sets: { orderBy: { setNumber: 'asc' } },
            teamA: { select: { id: true, name: true } },
            teamB: { select: { id: true, name: true } },
            winner: { select: { id: true, name: true } },
            pointEvents: { orderBy: { timestamp: 'asc' } },
        },
    },
    athletes: {
        include: {
            teamMember: {
                include: { user: { select: { id: true, name: true, avatarUrl: true } } },
            },
        },
    },
};
const CATEGORY_FORMAT_ATHLETE_COUNT = {
    PAIR: 2,
    QUARTET: 4,
    SEXTET: 6,
};
let FriendliesService = class FriendliesService {
    prisma;
    notificationService;
    chatService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    setChatService(chatService) {
        this.chatService = chatService;
    }
    async create(userId, dto) {
        if (dto.requesterTeamId) {
            const team = await this.prisma.team.findUnique({
                where: { id: dto.requesterTeamId },
            });
            if (!team || team.ownerId !== userId) {
                throw app_error_1.AppError.notTeamOwner();
            }
        }
        let resolvedChallengedId = dto.challengedId;
        if (dto.challengedTeamId) {
            const team = await this.prisma.team.findUnique({
                where: { id: dto.challengedTeamId },
            });
            if (!team) {
                throw app_error_1.AppError.teamNotFound();
            }
            if (!resolvedChallengedId) {
                resolvedChallengedId = team.ownerId;
            }
        }
        let resolvedCaptainId = dto.captainId;
        if (!resolvedCaptainId && dto.athleteIds && dto.athleteIds.length > 0 && dto.requesterTeamId) {
            const requesterTeam = await this.prisma.team.findUnique({
                where: { id: dto.requesterTeamId },
                select: { ownerId: true },
            });
            if (requesterTeam) {
                const ownerMember = await this.prisma.teamMember.findFirst({
                    where: { teamId: dto.requesterTeamId, userId: requesterTeam.ownerId },
                    select: { id: true },
                });
                if (ownerMember && dto.athleteIds.includes(ownerMember.id)) {
                    resolvedCaptainId = ownerMember.id;
                }
            }
        }
        if (dto.athleteIds && dto.athleteIds.length > 0) {
            if (!dto.requesterTeamId) {
                throw app_error_1.AppError.notTeamOwner();
            }
            if (dto.categoryFormat) {
                const expectedCount = CATEGORY_FORMAT_ATHLETE_COUNT[dto.categoryFormat];
                if (expectedCount !== undefined && dto.athleteIds.length !== expectedCount) {
                    throw app_error_1.AppError.invalidAthleteCount();
                }
            }
            const members = await this.prisma.teamMember.findMany({
                where: {
                    id: { in: dto.athleteIds },
                    teamId: dto.requesterTeamId,
                },
                select: { id: true },
            });
            const memberIds = new Set(members.map((m) => m.id));
            for (const athleteId of dto.athleteIds) {
                if (!memberIds.has(athleteId)) {
                    throw app_error_1.AppError.athleteNotInTeam();
                }
            }
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const friendly = await tx.friendly.create({
                data: {
                    requesterId: userId,
                    requesterTeamId: dto.requesterTeamId,
                    challengedId: resolvedChallengedId,
                    challengedTeamId: dto.challengedTeamId,
                    title: dto.title,
                    description: dto.description,
                    date: new Date(dto.date),
                    startTime: dto.startTime ? new Date(dto.startTime) : undefined,
                    address: dto.address,
                    city: dto.city,
                    state: dto.state,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                    regionRadius: dto.regionRadius,
                    modality: dto.modality,
                    categoryFormat: dto.categoryFormat,
                },
                include: FRIENDLY_INCLUDE,
            });
            if (dto.athleteIds && dto.athleteIds.length > 0) {
                await tx.friendlyAthlete.createMany({
                    data: dto.athleteIds.map((teamMemberId) => ({
                        friendlyId: friendly.id,
                        teamMemberId,
                        side: 'REQUESTER',
                        isCaptain: resolvedCaptainId === teamMemberId,
                    })),
                });
            }
            return tx.friendly.findUnique({
                where: { id: friendly.id },
                include: FRIENDLY_INCLUDE,
            });
        });
        if (resolvedChallengedId) {
            const requesterName = result?.requester?.name ?? 'Alguém';
            const requesterTeamName = result?.requesterTeam?.name;
            const body = requesterTeamName
                ? `${requesterName} do time ${requesterTeamName} solicitou um amistoso contra o seu time!`
                : `${requesterName} solicitou um amistoso contra o seu time!`;
            await this.notificationService.createNotification(resolvedChallengedId, 'Nova Solicitação de Amistoso', body, 'FRIENDLY_REQUEST', result.id);
        }
        if (this.chatService && dto.requesterTeamId && dto.challengedTeamId) {
            await this.chatService.createInterTeamChat(dto.requesterTeamId, dto.challengedTeamId);
        }
        return result;
    }
    async accept(friendlyId, userId, dto) {
        const friendly = await this.findFriendlyOrThrow(friendlyId);
        if (friendly.requesterId === userId) {
            throw app_error_1.AppError.cannotAcceptOwnFriendly();
        }
        if (!friendly.challengedTeamId) {
            throw app_error_1.AppError.notChallengedTeamOwner();
        }
        const isChallengedTeamOwner = await this.isTeamOwner(friendly.challengedTeamId, userId);
        if (!isChallengedTeamOwner) {
            throw app_error_1.AppError.notChallengedTeamOwner();
        }
        if (friendly.status !== client_1.FriendlyStatus.PENDING) {
            throw app_error_1.AppError.friendlyAlreadyResponded();
        }
        if (friendly.categoryFormat) {
            const expectedCount = CATEGORY_FORMAT_ATHLETE_COUNT[friendly.categoryFormat];
            if (expectedCount !== undefined && dto.athleteIds.length !== expectedCount) {
                throw app_error_1.AppError.invalidAthleteCount();
            }
        }
        let resolvedAcceptCaptainId = dto.captainId;
        if (!resolvedAcceptCaptainId && friendly.challengedTeamId) {
            const challengedTeam = await this.prisma.team.findUnique({
                where: { id: friendly.challengedTeamId },
                select: { ownerId: true },
            });
            if (challengedTeam) {
                const ownerMember = await this.prisma.teamMember.findFirst({
                    where: { teamId: friendly.challengedTeamId, userId: challengedTeam.ownerId },
                    select: { id: true },
                });
                if (ownerMember && dto.athleteIds.includes(ownerMember.id)) {
                    resolvedAcceptCaptainId = ownerMember.id;
                }
            }
        }
        if (friendly.challengedTeamId) {
            const members = await this.prisma.teamMember.findMany({
                where: { id: { in: dto.athleteIds }, teamId: friendly.challengedTeamId },
                select: { id: true },
            });
            const memberIds = new Set(members.map((m) => m.id));
            for (const aid of dto.athleteIds) {
                if (!memberIds.has(aid))
                    throw app_error_1.AppError.athleteNotInTeam();
            }
        }
        const accepted = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.friendly.update({
                where: { id: friendlyId },
                data: { status: client_1.FriendlyStatus.ACCEPTED },
                include: FRIENDLY_INCLUDE,
            });
            if (dto.athleteIds.length > 0) {
                await tx.friendlyAthlete.createMany({
                    data: dto.athleteIds.map((teamMemberId) => ({
                        friendlyId,
                        teamMemberId,
                        side: 'CHALLENGED',
                        isCaptain: resolvedAcceptCaptainId === teamMemberId,
                    })),
                });
            }
            const match = await tx.match.create({
                data: {
                    friendlyId: updated.id,
                    round: 0,
                    position: 0,
                    status: 'SCHEDULED',
                    teamAId: updated.requesterTeamId,
                    teamBId: updated.challengedTeamId,
                },
            });
            await tx.friendly.update({
                where: { id: updated.id },
                data: { matchId: match.id },
            });
            return tx.friendly.findUnique({
                where: { id: friendlyId },
                include: FRIENDLY_INCLUDE,
            });
        });
        const challengedTeamName = accepted?.challengedTeam?.name;
        const acceptBody = challengedTeamName
            ? `O time ${challengedTeamName} aceitou sua solicitação de amistoso!`
            : 'Sua solicitação de amistoso foi aceita!';
        await this.notificationService.createNotification(friendly.requesterId, 'Amistoso Aceito!', acceptBody, 'FRIENDLY_ACCEPTED', friendlyId);
        if (this.chatService && accepted?.requesterTeamId && accepted?.challengedTeamId) {
            await this.chatService.createInterTeamChat(accepted.requesterTeamId, accepted.challengedTeamId);
        }
        return accepted;
    }
    async reject(friendlyId, userId) {
        const friendly = await this.findFriendlyOrThrow(friendlyId);
        if (!friendly.challengedTeamId || !(await this.isTeamOwner(friendly.challengedTeamId, userId))) {
            throw app_error_1.AppError.notChallengedTeamOwner();
        }
        if (friendly.status !== client_1.FriendlyStatus.PENDING) {
            throw app_error_1.AppError.friendlyAlreadyResponded();
        }
        return this.prisma.friendly.update({
            where: { id: friendlyId },
            data: { status: client_1.FriendlyStatus.REJECTED },
            include: FRIENDLY_INCLUDE,
        });
    }
    async cancel(friendlyId, userId) {
        const friendly = await this.findFriendlyOrThrow(friendlyId);
        if (friendly.requesterId !== userId) {
            throw app_error_1.AppError.notFriendlyRequester();
        }
        if (friendly.status === client_1.FriendlyStatus.CANCELLED) {
            throw app_error_1.AppError.friendlyAlreadyCancelled();
        }
        if (friendly.status !== client_1.FriendlyStatus.PENDING && friendly.status !== client_1.FriendlyStatus.ACCEPTED) {
            throw app_error_1.AppError.friendlyAlreadyResponded();
        }
        return this.prisma.friendly.update({
            where: { id: friendlyId },
            data: { status: client_1.FriendlyStatus.CANCELLED },
            include: FRIENDLY_INCLUDE,
        });
    }
    async selectAthletes(friendlyId, userId, athleteIds) {
        const friendly = await this.findFriendlyOrThrow(friendlyId);
        if (friendly.status !== client_1.FriendlyStatus.ACCEPTED) {
            throw app_error_1.AppError.friendlyNotAccepted();
        }
        if (!friendly.challengedTeamId) {
            throw app_error_1.AppError.notChallengedTeamOwner();
        }
        const isOwner = await this.isTeamOwner(friendly.challengedTeamId, userId);
        if (!isOwner) {
            throw app_error_1.AppError.notChallengedTeamOwner();
        }
        if (friendly.categoryFormat) {
            const expectedCount = CATEGORY_FORMAT_ATHLETE_COUNT[friendly.categoryFormat];
            if (expectedCount !== undefined && athleteIds.length !== expectedCount) {
                throw app_error_1.AppError.invalidAthleteCount();
            }
        }
        const members = await this.prisma.teamMember.findMany({
            where: {
                id: { in: athleteIds },
                teamId: friendly.challengedTeamId,
            },
            select: { id: true },
        });
        const memberIds = new Set(members.map((m) => m.id));
        for (const athleteId of athleteIds) {
            if (!memberIds.has(athleteId)) {
                throw app_error_1.AppError.athleteNotInTeam();
            }
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.friendlyAthlete.deleteMany({
                where: {
                    friendlyId,
                    side: 'CHALLENGED',
                },
            });
            if (athleteIds.length > 0) {
                await tx.friendlyAthlete.createMany({
                    data: athleteIds.map((teamMemberId) => ({
                        friendlyId,
                        teamMemberId,
                        side: 'CHALLENGED',
                    })),
                });
            }
        });
        return this.prisma.friendly.findUnique({
            where: { id: friendlyId },
            include: FRIENDLY_INCLUDE,
        });
    }
    async generateRefereeCode(friendlyId, userId) {
        const friendly = await this.findFriendlyOrThrow(friendlyId);
        const captains = await this.prisma.friendlyAthlete.findMany({
            where: { friendlyId, isCaptain: true },
        });
        const captainMemberIds = captains.map((a) => a.teamMemberId);
        const isCaptain = captainMemberIds.length > 0
            ? !!(await this.prisma.teamMember.findFirst({
                where: { id: { in: captainMemberIds }, userId },
            }))
            : false;
        if (!isCaptain) {
            throw app_error_1.AppError.notFriendlyParticipant();
        }
        if (friendly.refereeCode) {
            return { code: friendly.refereeCode };
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await this.prisma.friendly.update({
            where: { id: friendlyId },
            data: {
                refereeCode: code,
                refereeCodeExpiresAt: expiresAt,
            },
        });
        return { code };
    }
    async enterRefereeCode(userId, code) {
        const friendly = await this.prisma.friendly.findFirst({
            where: {
                refereeCode: code,
                refereeCodeExpiresAt: { gt: new Date() },
            },
            include: FRIENDLY_INCLUDE,
        });
        if (!friendly) {
            throw app_error_1.AppError.invalidRefereeCode();
        }
        let match = await this.prisma.match.findUnique({
            where: { friendlyId: friendly.id },
        });
        if (!match) {
            match = await this.prisma.match.create({
                data: {
                    friendlyId: friendly.id,
                    round: 0,
                    position: 0,
                    status: 'SCHEDULED',
                    teamAId: friendly.requesterTeamId,
                    teamBId: friendly.challengedTeamId,
                },
            });
            await this.prisma.friendly.update({
                where: { id: friendly.id },
                data: { matchId: match.id },
            });
        }
        await this.prisma.match.update({
            where: { id: match.id },
            data: { refereeId: userId },
        });
        const updatedFriendly = await this.prisma.friendly.findUnique({
            where: { id: friendly.id },
            include: FRIENDLY_INCLUDE,
        });
        const updatedMatch = await this.prisma.match.findUnique({
            where: { id: match.id },
            include: {
                sets: { orderBy: { setNumber: 'asc' } },
                teamA: { select: { id: true, name: true } },
                teamB: { select: { id: true, name: true } },
                winner: { select: { id: true, name: true } },
            },
        });
        return { friendly: updatedFriendly, match: updatedMatch };
    }
    async findMine(userId, query) {
        const userMemberIds = await this.prisma.teamMember.findMany({
            where: { userId },
            select: { id: true },
        });
        const memberIds = userMemberIds.map((m) => m.id);
        const athleteFriendlies = await this.prisma.friendlyAthlete.findMany({
            where: { teamMemberId: { in: memberIds } },
            select: { friendlyId: true },
        });
        const friendlyIds = [...new Set(athleteFriendlies.map((a) => a.friendlyId))];
        const where = {
            OR: [
                { requesterId: userId },
                { challengedId: userId },
                { id: { in: friendlyIds } },
            ],
        };
        if (query.status)
            where.OR.forEach((cond) => { cond.status = query.status; });
        if (query.city)
            where.OR.forEach((cond) => { cond.city = query.city; });
        if (query.status || query.city) {
            const baseConditions = { OR: [
                    { requesterId: userId },
                    { challengedId: userId },
                    { id: { in: friendlyIds } },
                ] };
            const filters = {};
            if (query.status)
                filters.status = query.status;
            if (query.city)
                filters.city = { equals: query.city, mode: 'insensitive' };
            if (query.dateFrom || query.dateTo) {
                filters.date = {
                    ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
                    ...(query.dateTo && { lte: new Date(query.dateTo) }),
                };
            }
            return this.prisma.friendly.findMany({
                where: { AND: [baseConditions, filters] },
                include: FRIENDLY_INCLUDE,
                orderBy: { date: 'asc' },
            });
        }
        return this.prisma.friendly.findMany({
            where: {
                OR: [
                    { requesterId: userId },
                    { challengedId: userId },
                    { id: { in: friendlyIds } },
                ],
            },
            include: FRIENDLY_INCLUDE,
            orderBy: { date: 'asc' },
        });
    }
    async findNearby(query) {
        const { latitude, longitude, radius = 50 } = query;
        if (!latitude || !longitude) {
            return [];
        }
        const kmPerDegreeLat = 111;
        const kmPerDegreeLng = 111 * Math.cos((latitude * Math.PI) / 180);
        const latDelta = radius / kmPerDegreeLat;
        const lngDelta = radius / kmPerDegreeLng;
        return this.prisma.friendly.findMany({
            where: {
                status: { in: [client_1.FriendlyStatus.PENDING, client_1.FriendlyStatus.ACCEPTED] },
                latitude: { not: null },
                longitude: { not: null },
                AND: [
                    { latitude: { gte: latitude - latDelta } },
                    { latitude: { lte: latitude + latDelta } },
                    { longitude: { gte: longitude - lngDelta } },
                    { longitude: { lte: longitude + lngDelta } },
                ],
            },
            include: FRIENDLY_INCLUDE,
            orderBy: { date: 'asc' },
        });
    }
    async findOne(friendlyId, userId) {
        const friendly = await this.findFriendlyOrThrow(friendlyId);
        const isRequester = friendly.requesterId === userId;
        const isChallenged = friendly.challengedId === userId;
        const userMemberIds = await this.prisma.teamMember.findMany({
            where: { userId },
            select: { id: true },
        });
        const isAthlete = await this.prisma.friendlyAthlete.findFirst({
            where: { friendlyId, teamMemberId: { in: userMemberIds.map((m) => m.id) } },
        });
        if (!isRequester && !isChallenged && !isAthlete) {
            throw app_error_1.AppError.friendlyNotFound();
        }
        return friendly;
    }
    async explore(query) {
        const where = {
            status: { in: [client_1.FriendlyStatus.PENDING, client_1.FriendlyStatus.ACCEPTED] },
            latitude: { not: null },
            longitude: { not: null },
        };
        if (query.city) {
            where.city = { equals: query.city, mode: 'insensitive' };
        }
        if (query.dateFrom || query.dateTo) {
            where.date = {
                ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
                ...(query.dateTo && { lte: new Date(query.dateTo) }),
            };
        }
        if (query.latitude && query.longitude) {
            const radius = query.radius || 50;
            const kmPerDegreeLat = 111;
            const kmPerDegreeLng = 111 * Math.cos((query.latitude * Math.PI) / 180);
            const latDelta = radius / kmPerDegreeLat;
            const lngDelta = radius / kmPerDegreeLng;
            where.AND = [
                { latitude: { gte: query.latitude - latDelta } },
                { latitude: { lte: query.latitude + latDelta } },
                { longitude: { gte: query.longitude - lngDelta } },
                { longitude: { lte: query.longitude + lngDelta } },
            ];
        }
        return this.prisma.friendly.findMany({
            where,
            include: FRIENDLY_INCLUDE,
            orderBy: { date: 'asc' },
            take: 20,
        });
    }
    async findFriendlyOrThrow(friendlyId) {
        const friendly = await this.prisma.friendly.findUnique({
            where: { id: friendlyId },
            include: FRIENDLY_INCLUDE,
        });
        if (!friendly) {
            throw app_error_1.AppError.friendlyNotFound();
        }
        return friendly;
    }
    async isTeamOwner(teamId, userId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        return team?.ownerId === userId;
    }
};
exports.FriendliesService = FriendliesService;
exports.FriendliesService = FriendliesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], FriendliesService);
//# sourceMappingURL=friendlies.service.js.map