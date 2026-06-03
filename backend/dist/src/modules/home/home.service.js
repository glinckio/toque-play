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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const client_1 = require("@prisma/client");
let HomeService = class HomeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(userId) {
        const [upcomingRaw, popularRaw, friendliesRaw, acceptedFriendlies, unreadNotifications,] = await Promise.all([
            this.getUpcomingTournaments(userId),
            this.getPopularNearby(userId),
            this.getPendingFriendlies(userId),
            this.getAcceptedFriendlies(userId),
            this.getUnreadCount(userId),
        ]);
        const upcomingTournaments = upcomingRaw;
        const popularTournaments = popularRaw.map((t) => ({
            id: t.id,
            name: t.name,
            startDate: t.stages[0]?.date?.toISOString() ?? '',
            city: t.stages[0]?.city ?? '',
            modality: t.categories[0]?.modality ?? '',
            registrationCount: t._count.registrations,
        }));
        const pendingFriendlies = friendliesRaw.map((f) => ({
            id: f.id,
            title: f.title,
            teamAName: f.requesterTeam?.name ?? f.requester?.name ?? '',
            teamBName: f.challengedTeam?.name ?? f.challenged?.name ?? '',
            date: f.date.toISOString(),
            status: f.status,
        }));
        return {
            upcomingTournaments,
            popularTournaments,
            pendingFriendlies,
            acceptedFriendlies,
            unreadNotifications,
        };
    }
    async getUpcomingTournaments(userId) {
        const statusFilter = { in: [client_1.TournamentStatus.PUBLISHED, client_1.TournamentStatus.REGISTRATION_OPEN, client_1.TournamentStatus.REGISTRATION_CLOSED, client_1.TournamentStatus.BRACKET_GENERATED, client_1.TournamentStatus.IN_PROGRESS] };
        const [registrations, created] = await Promise.all([
            this.prisma.registration.findMany({
                where: {
                    userId,
                    status: { in: [client_1.RegistrationStatus.CONFIRMED, client_1.RegistrationStatus.PENDING_CONFIRMATION] },
                    tournament: { status: statusFilter },
                },
                select: {
                    tournament: {
                        select: {
                            id: true,
                            name: true,
                            stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true }, orderBy: { date: 'asc' } },
                            categories: { select: { modality: true }, take: 1 },
                            _count: { select: { registrations: true } },
                        },
                    },
                },
                take: 5,
            }),
            this.prisma.tournament.findMany({
                where: { ownerId: userId, status: statusFilter },
                select: {
                    id: true,
                    name: true,
                    stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true }, orderBy: { date: 'asc' } },
                    categories: { select: { modality: true }, take: 1 },
                    _count: { select: { registrations: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);
        const mapTournament = (t) => {
            const s = t.stages?.[0];
            const addressParts = [s?.street, s?.number].filter(Boolean).join(', ');
            const location = [addressParts, s?.neighborhood, s?.city, s?.state].filter(Boolean).join(s?.neighborhood || addressParts ? ' — ' : '').replace(/ — /, s?.neighborhood && addressParts ? ', ' : ' — ');
            const fullLocation = [s?.street, s?.number].filter(Boolean).join(', ')
                + (s?.neighborhood ? `, ${s.neighborhood}` : '')
                + (s?.city ? ` — ${s.city}` : '')
                + (s?.state ? `/${s.state}` : '');
            return {
                id: t.id,
                name: t.name,
                startDate: s?.date?.toISOString() ?? '',
                city: s?.city ?? '',
                street: s?.street ?? '',
                number: s?.number ?? '',
                neighborhood: s?.neighborhood ?? '',
                state: s?.state ?? '',
                location: fullLocation,
                modality: t.categories?.[0]?.modality ?? '',
                registrationCount: t._count?.registrations ?? 0,
            };
        };
        const seen = new Set();
        const merged = [];
        for (const r of registrations) {
            const t = r.tournament;
            if (!seen.has(t.id)) {
                seen.add(t.id);
                merged.push(mapTournament(t));
            }
        }
        for (const t of created) {
            if (!seen.has(t.id)) {
                seen.add(t.id);
                merged.push(mapTournament(t));
            }
        }
        return merged;
    }
    async getPopularNearby(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { latitude: true, longitude: true },
        });
        if (!user?.latitude || !user?.longitude)
            return [];
        const kmPerDegreeLat = 111;
        const kmPerDegreeLng = 111 * Math.cos((user.latitude * Math.PI) / 180);
        const radius = 100;
        const latDelta = radius / kmPerDegreeLat;
        const lngDelta = radius / kmPerDegreeLng;
        return this.prisma.tournament.findMany({
            where: {
                status: { in: [client_1.TournamentStatus.PUBLISHED, client_1.TournamentStatus.REGISTRATION_OPEN] },
                stages: {
                    some: {
                        latitude: {
                            gte: user.latitude - latDelta,
                            lte: user.latitude + latDelta,
                        },
                        longitude: {
                            gte: user.longitude - lngDelta,
                            lte: user.longitude + lngDelta,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                status: true,
                stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true }, orderBy: { date: 'asc' } },
                categories: { select: { type: true, format: true, modality: true } },
                _count: { select: { registrations: true } },
            },
            orderBy: { registrations: { _count: 'desc' } },
            take: 5,
        });
    }
    async getPendingFriendlies(userId) {
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
        return this.prisma.friendly.findMany({
            where: {
                status: client_1.FriendlyStatus.PENDING,
                OR: [
                    { challengedId: userId },
                    { id: { in: friendlyIds } },
                ],
            },
            select: {
                id: true,
                title: true,
                date: true,
                status: true,
                requester: { select: { name: true } },
                requesterTeam: { select: { name: true } },
                challenged: { select: { name: true } },
                challengedTeam: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
    }
    async getAcceptedFriendlies(userId) {
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
        return this.prisma.friendly.findMany({
            where: {
                status: client_1.FriendlyStatus.ACCEPTED,
                OR: [
                    { requesterId: userId },
                    { challengedId: userId },
                    { id: { in: friendlyIds } },
                ],
            },
            include: {
                requester: { select: { id: true, name: true, avatarUrl: true } },
                requesterTeam: { select: { id: true, name: true, avatarUrl: true } },
                challenged: { select: { id: true, name: true, avatarUrl: true } },
                challengedTeam: { select: { id: true, name: true, avatarUrl: true } },
                match: {
                    select: {
                        id: true,
                        status: true,
                        scoreTeamA: true,
                        scoreTeamB: true,
                        teamA: { select: { id: true, name: true } },
                        teamB: { select: { id: true, name: true } },
                        sets: { orderBy: { setNumber: 'asc' } },
                    },
                },
            },
            orderBy: { date: 'asc' },
            take: 5,
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: { userId, read: false },
        });
    }
    async getFeed(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { latitude: true, longitude: true },
        });
        const [newTournaments, finishedResults, confirmedFriendlies] = await Promise.all([
            this.getNewTournamentsNearby(user),
            this.getFinishedResults(userId),
            this.getConfirmedFriendlies(userId),
        ]);
        return [...newTournaments, ...finishedResults, ...confirmedFriendlies]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 20);
    }
    async getNewTournamentsNearby(user) {
        if (!user?.latitude || !user?.longitude)
            return [];
        const kmPerDegreeLat = 111;
        const kmPerDegreeLng = 111 * Math.cos((user.latitude * Math.PI) / 180);
        const radius = 100;
        const latDelta = radius / kmPerDegreeLat;
        const lngDelta = radius / kmPerDegreeLng;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const tournaments = await this.prisma.tournament.findMany({
            where: {
                createdAt: { gte: weekAgo },
                status: { not: client_1.TournamentStatus.CANCELLED },
                stages: {
                    some: {
                        latitude: {
                            gte: user.latitude - latDelta,
                            lte: user.latitude + latDelta,
                        },
                        longitude: {
                            gte: user.longitude - lngDelta,
                            lte: user.longitude + lngDelta,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                stages: { select: { street: true, number: true, neighborhood: true, city: true, state: true }, take: 1 },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return tournaments.map((t) => ({
            type: 'NEW_TOURNAMENT',
            referenceId: t.id,
            title: `Novo torneio: ${t.name}`,
            subtitle: t.stages[0]?.city ? `${t.stages[0].city}, ${t.stages[0].state}` : undefined,
            timestamp: t.createdAt,
        }));
    }
    async getFinishedResults(userId) {
        const registrations = await this.prisma.registration.findMany({
            where: {
                userId,
                status: client_1.RegistrationStatus.CONFIRMED,
                tournament: { status: client_1.TournamentStatus.FINISHED },
            },
            include: {
                tournament: {
                    select: {
                        id: true,
                        name: true,
                        updatedAt: true,
                        brackets: {
                            include: {
                                matches: {
                                    where: { winnerId: { not: null } },
                                    include: { winner: { select: { id: true, name: true } } },
                                    take: 1,
                                    orderBy: { round: 'desc' },
                                },
                            },
                            take: 1,
                        },
                    },
                },
            },
            take: 5,
        });
        return registrations.map((r) => ({
            type: 'TOURNAMENT_RESULT',
            referenceId: r.tournament.id,
            title: `Resultado: ${r.tournament.name}`,
            subtitle: r.tournament.brackets[0]?.matches[0]?.winner?.name
                ? `Campeão: ${r.tournament.brackets[0].matches[0].winner.name}`
                : undefined,
            timestamp: r.tournament.updatedAt,
        }));
    }
    async getConfirmedFriendlies(userId) {
        const friendlies = await this.prisma.friendly.findMany({
            where: {
                status: client_1.FriendlyStatus.ACCEPTED,
                OR: [{ requesterId: userId }, { challengedId: userId }],
            },
            select: {
                id: true,
                date: true,
                city: true,
                requester: { select: { name: true } },
                challenged: { select: { name: true } },
            },
            orderBy: { date: 'asc' },
            take: 5,
        });
        return friendlies.map((f) => ({
            type: 'FRIENDLY_CONFIRMED',
            referenceId: f.id,
            title: `Amistoso confirmado`,
            subtitle: `${f.requester.name} vs ${f.challenged?.name || 'Time adversário'}${f.city ? ` — ${f.city}` : ''}`,
            timestamp: f.date,
        }));
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeService);
//# sourceMappingURL=home.service.js.map