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
exports.TournamentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const notification_service_1 = require("../../common/services/notification.service");
const app_error_1 = require("../../common/errors/app-error");
const client_1 = require("@prisma/client");
const OWNER_INCLUDE = {
    select: { id: true, name: true, email: true, avatarUrl: true },
};
const FULL_INCLUDE = {
    owner: OWNER_INCLUDE,
    categories: true,
    stages: { orderBy: { date: 'asc' }, include: { facilities: true } },
    sponsors: true,
    _count: { select: { registrations: true } },
};
let TournamentsService = class TournamentsService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async create(userId, dto) {
        return this.prisma.tournament.create({
            data: {
                name: dto.name,
                description: dto.description,
                ownerId: userId,
            },
            include: FULL_INCLUDE,
        });
    }
    async update(tournamentId, userId, dto) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { stages: true },
        });
        if (!tournament || tournament.ownerId !== userId) {
            throw app_error_1.AppError.notTournamentOwner();
        }
        this.ensureEditable(tournament);
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { name: dto.name, description: dto.description },
            include: FULL_INCLUDE,
        });
    }
    async updateStructure(tournamentId, userId, dto) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { stages: true },
        });
        if (!tournament || tournament.ownerId !== userId) {
            throw app_error_1.AppError.notTournamentOwner();
        }
        this.ensureDraft(tournament.status);
        this.ensureEditable(tournament);
        if (dto.eventType === client_1.TournamentEventType.CIRCUIT && (!dto.stages || dto.stages.length === 0)) {
            throw app_error_1.AppError.circuitRequiresStages();
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.stageFacility.deleteMany({ where: { stage: { tournamentId } } });
            await tx.tournamentStage.deleteMany({ where: { tournamentId } });
            await tx.tournamentCategory.deleteMany({ where: { tournamentId } });
            return tx.tournament.update({
                where: { id: tournamentId },
                data: {
                    eventType: dto.eventType,
                    stages: dto.stages
                        ? {
                            create: dto.stages.map((s) => ({
                                name: s.name,
                                date: new Date(s.date),
                                startTime: s.startTime ? new Date(s.startTime) : undefined,
                                maxTeams: s.maxTeams,
                                street: s.street,
                                number: s.number,
                                neighborhood: s.neighborhood,
                                cep: s.cep,
                                address: s.address ?? composeStageAddress(s),
                                city: s.city,
                                state: s.state,
                                latitude: s.latitude,
                                longitude: s.longitude,
                                regionRadius: s.regionRadius,
                                facilities: s.facilities
                                    ? {
                                        createMany: {
                                            data: s.facilities.map((f) => ({
                                                name: f.name,
                                                available: f.available ?? true,
                                            })),
                                        },
                                    }
                                    : undefined,
                            })),
                        }
                        : undefined,
                    categories: dto.categories
                        ? { createMany: { data: dto.categories.map((c) => ({
                                    ...c,
                                    startTime: c.startTime ? new Date(c.startTime) : undefined,
                                    registrationDeadline: c.registrationDeadline ? new Date(c.registrationDeadline) : undefined,
                                })) } }
                        : undefined,
                },
                include: FULL_INCLUDE,
            });
        });
    }
    async addStageFacilities(tournamentId, stageId, userId, facilities) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        this.ensureDraft(tournament.status);
        const stage = await this.prisma.tournamentStage.findFirst({
            where: { id: stageId, tournamentId },
        });
        if (!stage) {
            throw app_error_1.AppError.stageNotFound();
        }
        await this.prisma.stageFacility.createMany({
            data: facilities.map((f) => ({
                stageId,
                name: f.name,
                available: f.available ?? true,
            })),
        });
        return this.prisma.tournamentStage.findUnique({
            where: { id: stageId },
            include: { facilities: true },
        });
    }
    async removeStageFacility(tournamentId, stageId, facilityId, userId) {
        await this.verifyOwnership(tournamentId, userId);
        const facility = await this.prisma.stageFacility.findFirst({
            where: { id: facilityId, stage: { tournamentId } },
        });
        if (!facility) {
            throw app_error_1.AppError.facilityNotFound();
        }
        await this.prisma.stageFacility.delete({ where: { id: facilityId } });
    }
    async addSponsors(tournamentId, userId, dto) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        this.ensureDraft(tournament.status);
        await this.prisma.sponsor.createMany({
            data: dto.sponsors.map((s) => ({
                tournamentId,
                name: s.name,
                logoUrl: s.logoUrl,
                description: s.description,
            })),
        });
        return this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { sponsors: true },
        });
    }
    async removeSponsor(tournamentId, sponsorId, userId) {
        await this.verifyOwnership(tournamentId, userId);
        const sponsor = await this.prisma.sponsor.findFirst({
            where: { id: sponsorId, tournamentId },
        });
        if (!sponsor) {
            throw app_error_1.AppError.sponsorNotFound();
        }
        await this.prisma.sponsor.delete({ where: { id: sponsorId } });
    }
    async getSummary(tournamentId, userId) {
        await this.verifyOwnership(tournamentId, userId);
        return this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: FULL_INCLUDE,
        });
    }
    async publish(tournamentId, userId) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        if (tournament.status !== client_1.TournamentStatus.DRAFT) {
            throw app_error_1.AppError.tournamentAlreadyPublished();
        }
        const tournamentWithRelations = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { stages: true, categories: true },
        });
        if (!tournamentWithRelations) {
            throw app_error_1.AppError.tournamentNotFound();
        }
        const missing = [];
        if (!tournamentWithRelations.name)
            missing.push('name');
        if (tournamentWithRelations.stages.length === 0)
            missing.push('at least one stage');
        if (tournamentWithRelations.categories.length === 0)
            missing.push('at least one category');
        const stagesWithoutLocation = tournamentWithRelations.stages.some((s) => !s.city && !s.address && !s.street);
        if (stagesWithoutLocation)
            missing.push('location on all stages (city or address)');
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 7);
        minDate.setHours(0, 0, 0, 0);
        for (const stage of tournamentWithRelations.stages) {
            const stageDate = new Date(stage.date);
            stageDate.setHours(0, 0, 0, 0);
            if (stageDate < minDate) {
                throw app_error_1.AppError.stageDateTooSoon();
            }
        }
        if (missing.length > 0) {
            throw app_error_1.AppError.publishMissingFields();
        }
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: client_1.TournamentStatus.PUBLISHED, isPublished: true },
            include: FULL_INCLUDE,
        });
    }
    async startTournament(tournamentId, userId) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        if (tournament.status !== client_1.TournamentStatus.BRACKET_GENERATED) {
            throw app_error_1.AppError.tournamentNotReady();
        }
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: client_1.TournamentStatus.IN_PROGRESS },
            include: FULL_INCLUDE,
        });
    }
    async generateRefereeCode(tournamentId, userId) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        if (tournament.status !== client_1.TournamentStatus.BRACKET_GENERATED && tournament.status !== client_1.TournamentStatus.IN_PROGRESS) {
            throw app_error_1.AppError.tournamentNotReady();
        }
        const t = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });
        if (t?.refereeCode) {
            return { code: t.refereeCode };
        }
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        await this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { refereeCode: code },
        });
        return { code };
    }
    async enterRefereeCode(userId, code) {
        const tournament = await this.prisma.tournament.findFirst({
            where: {
                refereeCode: code,
                status: { in: [client_1.TournamentStatus.BRACKET_GENERATED, client_1.TournamentStatus.IN_PROGRESS] },
            },
        });
        if (!tournament) {
            throw app_error_1.AppError.invalidRefereeCode();
        }
        await this.prisma.tournamentReferee.upsert({
            where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
            update: { codeConfirmed: true },
            create: { tournamentId: tournament.id, userId, codeConfirmed: true },
        });
        return { tournamentId: tournament.id, tournamentName: tournament.name };
    }
    async addReferee(tournamentId, organizerId, email) {
        await this.verifyOwnership(tournamentId, organizerId);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw app_error_1.AppError.userNotFound();
        const result = await this.prisma.tournamentReferee.upsert({
            where: { tournamentId_userId: { tournamentId, userId: user.id } },
            update: {},
            create: { tournamentId, userId: user.id },
            include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        });
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            select: { name: true },
        });
        await this.notificationService.createNotification(user.id, 'Convite de Árbitro', `Você foi adicionado como árbitro do torneio ${tournament?.name ?? ''}.`, 'REFEREE_ASSIGNED', tournamentId);
        return result;
    }
    async removeReferee(tournamentId, organizerId, refereeId) {
        await this.verifyOwnership(tournamentId, organizerId);
        await this.prisma.tournamentReferee.delete({
            where: { id: refereeId },
        });
    }
    async getReferees(tournamentId) {
        return this.prisma.tournamentReferee.findMany({
            where: { tournamentId },
            include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        });
    }
    async findRefereeTournaments(userId) {
        const refs = await this.prisma.tournamentReferee.findMany({
            where: { userId },
            include: {
                tournament: {
                    include: {
                        stages: { orderBy: { date: 'asc' }, take: 1 },
                        _count: { select: { brackets: true } },
                    },
                },
            },
            orderBy: { invitedAt: 'desc' },
        });
        return refs.map((r) => ({
            ...r.tournament,
            invitedAt: r.invitedAt,
        }));
    }
    async saveAsDraft(tournamentId, userId) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        if (tournament.status === client_1.TournamentStatus.IN_PROGRESS ||
            tournament.status === client_1.TournamentStatus.FINISHED ||
            tournament.status === client_1.TournamentStatus.CANCELLED) {
            throw app_error_1.AppError.tournamentNotDraft();
        }
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: client_1.TournamentStatus.DRAFT, isPublished: false },
            include: FULL_INCLUDE,
        });
    }
    async findAll(query) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.city || query.state) {
            where.stages = {
                some: {
                    ...(query.city && { city: { equals: query.city, mode: 'insensitive' } }),
                    ...(query.state && { state: query.state }),
                },
            };
        }
        if (query.categoryType || query.categoryFormat || query.categoryModality) {
            where.categories = {
                some: {
                    ...(query.categoryType && { type: query.categoryType }),
                    ...(query.categoryFormat && { format: query.categoryFormat }),
                    ...(query.categoryModality && { modality: query.categoryModality }),
                },
            };
        }
        return this.prisma.tournament.findMany({
            where,
            include: {
                owner: OWNER_INCLUDE,
                categories: true,
                _count: { select: { categories: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findMine(userId) {
        return this.prisma.tournament.findMany({
            where: { ownerId: userId },
            include: {
                owner: OWNER_INCLUDE,
                stages: { orderBy: { date: 'asc' } },
                _count: { select: { categories: true, registrations: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(tournamentId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: FULL_INCLUDE,
        });
        if (!tournament) {
            throw app_error_1.AppError.tournamentNotFound();
        }
        return tournament;
    }
    async cancel(tournamentId, userId) {
        const tournament = await this.verifyOwnership(tournamentId, userId);
        if (tournament.status === client_1.TournamentStatus.IN_PROGRESS ||
            tournament.status === client_1.TournamentStatus.FINISHED ||
            tournament.status === client_1.TournamentStatus.CANCELLED) {
            throw app_error_1.AppError.tournamentCannotCancel();
        }
        return this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: client_1.TournamentStatus.CANCELLED },
            include: FULL_INCLUDE,
        });
    }
    async verifyOwnership(tournamentId, userId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
        });
        if (!tournament) {
            throw app_error_1.AppError.tournamentNotFound();
        }
        if (tournament.ownerId !== userId) {
            throw app_error_1.AppError.notTournamentOwner();
        }
        return tournament;
    }
    async explore(query) {
        const where = {
            status: { notIn: [client_1.TournamentStatus.DRAFT, client_1.TournamentStatus.CANCELLED] },
        };
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }
        if (query.city || query.state) {
            where.stages = {
                some: {
                    ...(query.city && { city: { equals: query.city, mode: 'insensitive' } }),
                    ...(query.state && { state: query.state }),
                },
            };
        }
        if (query.type || query.format || query.modality) {
            where.categories = {
                some: {
                    ...(query.type && { type: query.type }),
                    ...(query.format && { format: query.format }),
                    ...(query.modality && { modality: query.modality }),
                },
            };
        }
        if (query.dateFrom || query.dateTo) {
            where.stages = where.stages || { some: {} };
            where.stages.some.date = {
                ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
                ...(query.dateTo && { lte: new Date(query.dateTo) }),
            };
        }
        if (query.priceMin !== undefined || query.priceMax !== undefined) {
            where.categories = where.categories || { some: {} };
            where.categories.some.registrationPrice = {
                ...(query.priceMin !== undefined && { gte: query.priceMin }),
                ...(query.priceMax !== undefined && { lte: query.priceMax }),
            };
        }
        if (query.latitude && query.longitude) {
            const radius = query.radius || 50;
            const kmPerDegreeLat = 111;
            const kmPerDegreeLng = 111 * Math.cos((query.latitude * Math.PI) / 180);
            const latDelta = radius / kmPerDegreeLat;
            const lngDelta = radius / kmPerDegreeLng;
            where.stages = where.stages || { some: {} };
            where.stages.some.latitude = {
                gte: query.latitude - latDelta,
                lte: query.latitude + latDelta,
            };
            where.stages.some.longitude = {
                gte: query.longitude - lngDelta,
                lte: query.longitude + lngDelta,
            };
        }
        const limit = query.limit || 20;
        const cursorObj = query.cursor ? { id: query.cursor } : undefined;
        return this.prisma.tournament.findMany({
            where,
            select: {
                id: true,
                name: true,
                imageUrl: true,
                status: true,
                createdAt: true,
                stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true, maxTeams: true }, orderBy: { date: 'asc' } },
                categories: { select: { type: true, format: true, modality: true, registrationPrice: true } },
                owner: OWNER_INCLUDE,
                _count: { select: { registrations: true } },
                registrations: {
                    select: { team: { select: { id: true, name: true, avatarUrl: true } } },
                    take: 6,
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit + 1,
            ...(cursorObj && { skip: 1, cursor: cursorObj }),
        });
    }
    async exploreWithNearby(query) {
        const { latitude, longitude, ...filters } = query;
        const nearbyLimit = 3;
        const allLimit = query.limit || 20;
        let nearby = [];
        if (latitude && longitude) {
            const radius = query.radius || 100;
            const kmPerDegreeLat = 111;
            const kmPerDegreeLng = 111 * Math.cos((latitude * Math.PI) / 180);
            const latDelta = radius / kmPerDegreeLat;
            const lngDelta = radius / kmPerDegreeLng;
            const nearbyWhere = {
                status: { notIn: [client_1.TournamentStatus.DRAFT, client_1.TournamentStatus.CANCELLED] },
                stages: {
                    some: {
                        latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
                        longitude: { gte: longitude - lngDelta, lte: longitude + lngDelta },
                    },
                },
            };
            if (filters.search)
                nearbyWhere.name = { contains: filters.search, mode: 'insensitive' };
            if (filters.type || filters.format || filters.modality) {
                nearbyWhere.categories = {
                    some: {
                        ...(filters.type && { type: filters.type }),
                        ...(filters.format && { format: filters.format }),
                        ...(filters.modality && { modality: filters.modality }),
                    },
                };
            }
            nearby = await this.prisma.tournament.findMany({
                where: nearbyWhere,
                select: {
                    id: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true, latitude: true, longitude: true, maxTeams: true }, orderBy: { date: 'asc' } },
                    categories: { select: { type: true, format: true, modality: true, registrationPrice: true } },
                    owner: OWNER_INCLUDE,
                    _count: { select: { registrations: true } },
                    registrations: { select: { team: { select: { id: true, name: true, avatarUrl: true } } }, take: 6 },
                },
                orderBy: { createdAt: 'desc' },
                take: nearbyLimit,
            });
            nearby = nearby.map((t) => {
                const s = t.stages?.[0];
                let distanceKm = null;
                if (s?.latitude && s?.longitude) {
                    const dLat = (s.latitude - latitude) * 111;
                    const dLng = (s.longitude - longitude) * 111 * Math.cos((latitude * Math.PI) / 180);
                    distanceKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
                }
                return { ...t, distanceKm };
            });
        }
        const nearbyIds = nearby.map((t) => t.id);
        const allWhere = {
            status: { notIn: [client_1.TournamentStatus.DRAFT, client_1.TournamentStatus.CANCELLED] },
            ...(nearbyIds.length > 0 && { id: { notIn: nearbyIds } }),
        };
        if (filters.search)
            allWhere.name = { contains: filters.search, mode: 'insensitive' };
        if (filters.city || filters.state) {
            allWhere.stages = {
                some: {
                    ...(filters.city && { city: { equals: filters.city, mode: 'insensitive' } }),
                    ...(filters.state && { state: filters.state }),
                },
            };
        }
        if (filters.type || filters.format || filters.modality) {
            allWhere.categories = {
                some: {
                    ...(filters.type && { type: filters.type }),
                    ...(filters.format && { format: filters.format }),
                    ...(filters.modality && { modality: filters.modality }),
                },
            };
        }
        if (filters.dateFrom || filters.dateTo) {
            allWhere.stages = allWhere.stages || { some: {} };
            allWhere.stages.some.date = {
                ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
                ...(filters.dateTo && { lte: new Date(filters.dateTo) }),
            };
        }
        const all = await this.prisma.tournament.findMany({
            where: allWhere,
            select: {
                id: true,
                name: true,
                imageUrl: true,
                status: true,
                createdAt: true,
                stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true, maxTeams: true }, orderBy: { date: 'asc' } },
                categories: { select: { type: true, format: true, modality: true, registrationPrice: true } },
                owner: OWNER_INCLUDE,
                _count: { select: { registrations: true } },
                registrations: { select: { team: { select: { id: true, name: true, avatarUrl: true } } }, take: 6 },
            },
            orderBy: { createdAt: 'desc' },
            take: allLimit + 1,
        });
        const hasMore = all.length > allLimit;
        const allData = hasMore ? all.slice(0, -1) : all;
        return {
            nearby,
            all: allData,
            hasMore,
            nextCursor: hasMore ? allData[allData.length - 1]?.id : null,
        };
    }
    async getPublicDetails(tournamentId, userId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: {
                owner: OWNER_INCLUDE,
                categories: {
                    include: {
                        registrations: {
                            where: { status: { in: ['CONFIRMED', 'PENDING_PAYMENT', 'PENDING_CONFIRMATION'] } },
                            select: { id: true, status: true, team: { select: { id: true, name: true, avatarUrl: true } } },
                        },
                    },
                },
                stages: { include: { facilities: true }, orderBy: { date: 'asc' } },
                sponsors: true,
                brackets: {
                    include: {
                        matches: {
                            include: {
                                teamA: { select: { id: true, name: true, avatarUrl: true } },
                                teamB: { select: { id: true, name: true, avatarUrl: true } },
                                winner: { select: { id: true, name: true } },
                            },
                            orderBy: [{ round: 'asc' }, { position: 'asc' }],
                        },
                    },
                },
            },
        });
        if (!tournament) {
            throw app_error_1.AppError.tournamentNotFound();
        }
        for (const cat of tournament.categories) {
            const teamCount = {};
            const teamIndex = {};
            for (const reg of cat.registrations) {
                const tid = reg.team.id;
                teamCount[tid] = (teamCount[tid] ?? 0) + 1;
            }
            for (const reg of cat.registrations) {
                const tid = reg.team.id;
                if (teamCount[tid] > 1) {
                    teamIndex[tid] = (teamIndex[tid] ?? 0) + 1;
                    const suffix = String.fromCharCode(64 + teamIndex[tid]);
                    reg.teamDisplayName = `${reg.team.name} ${suffix}`;
                }
                else {
                    reg.teamDisplayName = reg.team.name;
                }
            }
        }
        let userRegistration = null;
        if (userId) {
            userRegistration = await this.prisma.registration.findFirst({
                where: { tournamentId, userId },
                select: { id: true, status: true, category: { select: { type: true, format: true } } },
            });
        }
        return { ...tournament, userRegistration };
    }
    ensureDraft(status) {
        if (status !== client_1.TournamentStatus.DRAFT) {
            throw app_error_1.AppError.tournamentNotDraft();
        }
    }
    ensureEditable(tournament) {
        if (tournament.status === client_1.TournamentStatus.DRAFT) {
            return;
        }
        if (tournament.status === client_1.TournamentStatus.IN_PROGRESS ||
            tournament.status === client_1.TournamentStatus.FINISHED ||
            tournament.status === client_1.TournamentStatus.CANCELLED) {
            throw app_error_1.AppError.tournamentCannotCancel();
        }
        const earliestStage = tournament.stages?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        if (earliestStage) {
            const stageDate = new Date(earliestStage.date);
            stageDate.setHours(0, 0, 0, 0);
            const limit = new Date();
            limit.setDate(limit.getDate() + 3);
            limit.setHours(0, 0, 0, 0);
            if (stageDate < limit) {
                throw app_error_1.AppError.tournamentTooCloseToEdit();
            }
        }
    }
};
exports.TournamentsService = TournamentsService;
exports.TournamentsService = TournamentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notification_service_1.NotificationService])
], TournamentsService);
function composeStageAddress(stage) {
    const parts = [stage.street, stage.number, stage.neighborhood].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : undefined;
}
//# sourceMappingURL=tournaments.service.js.map