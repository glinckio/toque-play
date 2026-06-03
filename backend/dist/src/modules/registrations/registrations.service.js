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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const stripe_service_1 = require("../../common/services/stripe.service");
const tournaments_service_1 = require("../tournaments/tournaments.service");
const client_1 = require("@prisma/client");
const REGISTRATION_INCLUDE = {
    tournament: { select: { id: true, name: true, status: true } },
    category: { select: { id: true, type: true, format: true, modality: true, registrationPrice: true } },
    team: { select: { id: true, name: true } },
    user: { select: { id: true, name: true, email: true } },
    members: {
        include: {
            teamMember: {
                include: {
                    user: { select: { id: true, name: true, avatarUrl: true } },
                },
            },
        },
    },
};
let RegistrationsService = class RegistrationsService {
    prisma;
    tournamentsService;
    stripeService;
    expiryQueue;
    paymentsGateway;
    constructor(prisma, tournamentsService, stripeService, expiryQueue) {
        this.prisma = prisma;
        this.tournamentsService = tournamentsService;
        this.stripeService = stripeService;
        this.expiryQueue = expiryQueue;
    }
    setPaymentsGateway(gateway) {
        this.paymentsGateway = gateway;
    }
    async registerTeam(tournamentId, userId, dto) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
        });
        if (!tournament)
            throw app_error_1.AppError.tournamentNotFound();
        if (tournament.status !== client_1.TournamentStatus.PUBLISHED &&
            tournament.status !== client_1.TournamentStatus.REGISTRATION_OPEN) {
            throw app_error_1.AppError.tournamentNotOpen();
        }
        const category = await this.prisma.tournamentCategory.findUnique({
            where: { id: dto.categoryId },
        });
        if (!category || category.tournamentId !== tournamentId) {
            throw app_error_1.AppError.categoryNotInTournament();
        }
        if (category.registrationDeadline && new Date() > new Date(category.registrationDeadline)) {
            throw app_error_1.AppError.registrationDeadlineExpired();
        }
        const team = await this.prisma.team.findUnique({
            where: { id: dto.teamId },
            include: { members: true },
        });
        if (!team) {
            throw app_error_1.AppError.teamNotFound();
        }
        if (team.ownerId !== userId) {
            throw app_error_1.AppError.notTeamOwner();
        }
        const teamMemberIds = new Set(team.members.map((m) => m.id));
        for (const mid of dto.memberIds) {
            if (!teamMemberIds.has(mid)) {
                throw app_error_1.AppError.teamSizeMismatch();
            }
        }
        if (dto.memberIds.length < category.minMembers || dto.memberIds.length > category.maxMembers) {
            throw app_error_1.AppError.teamSizeMismatch();
        }
        const alreadyRegistered = await this.prisma.registrationMember.findMany({
            where: {
                teamMemberId: { in: dto.memberIds },
                registration: {
                    tournamentId,
                    status: { notIn: [client_1.RegistrationStatus.CANCELLED, client_1.RegistrationStatus.REJECTED] },
                },
            },
            select: { teamMemberId: true },
        });
        if (alreadyRegistered.length > 0) {
            throw app_error_1.AppError.teamAlreadyRegistered();
        }
        const isFree = !category.registrationPrice || Number(category.registrationPrice) === 0;
        const status = isFree ? client_1.RegistrationStatus.PENDING_CONFIRMATION : client_1.RegistrationStatus.PENDING_PAYMENT;
        const registration = await this.prisma.registration.create({
            data: {
                tournamentId,
                categoryId: dto.categoryId,
                teamId: dto.teamId,
                userId,
                status,
                members: {
                    create: dto.memberIds.map((teamMemberId) => ({
                        teamMemberId,
                        isCaptain: dto.captainMemberId ? teamMemberId === dto.captainMemberId : false,
                    })),
                },
            },
            include: REGISTRATION_INCLUDE,
        });
        if (!isFree) {
            await this.expiryQueue.add('expire', { registrationId: registration.id }, { delay: 30 * 60 * 1000 });
        }
        return registration;
    }
    async createCheckout(regId, userId) {
        const registration = await this.findRegistrationOrThrow(regId);
        if (registration.userId !== userId) {
            throw app_error_1.AppError.notRegistrationOwner();
        }
        if (registration.status !== client_1.RegistrationStatus.PENDING_PAYMENT) {
            throw app_error_1.AppError.registrationAlreadyConfirmed();
        }
        const category = await this.prisma.tournamentCategory.findUnique({
            where: { id: registration.categoryId },
        });
        const session = await this.stripeService.createCheckoutSession({
            registrationId: regId,
            amount: Number(category.registrationPrice),
            tournamentName: registration.tournament.name,
            categoryName: `${category.type} ${category.format} ${category.modality}`,
            teamName: registration.team.name,
        });
        await this.prisma.registration.update({
            where: { id: regId },
            data: { paymentId: session.id },
        });
        return { url: session.url };
    }
    async listByTournament(tournamentId, userId, query) {
        await this.tournamentsService.verifyOwnership(tournamentId, userId);
        const where = { tournamentId };
        if (query.status)
            where.status = query.status;
        if (query.categoryId)
            where.categoryId = query.categoryId;
        return this.prisma.registration.findMany({
            where,
            include: REGISTRATION_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async confirmRegistration(tournamentId, regId, userId) {
        await this.tournamentsService.verifyOwnership(tournamentId, userId);
        const registration = await this.findRegistrationOrThrow(regId);
        if (registration.tournamentId !== tournamentId) {
            throw app_error_1.AppError.registrationNotFound();
        }
        if (registration.status === client_1.RegistrationStatus.CONFIRMED) {
            throw app_error_1.AppError.registrationAlreadyConfirmed();
        }
        if (registration.status === client_1.RegistrationStatus.PENDING_PAYMENT) {
            throw app_error_1.AppError.paymentRequired();
        }
        return this.prisma.registration.update({
            where: { id: regId },
            data: { status: client_1.RegistrationStatus.CONFIRMED },
            include: REGISTRATION_INCLUDE,
        });
    }
    async rejectRegistration(tournamentId, regId, userId) {
        await this.tournamentsService.verifyOwnership(tournamentId, userId);
        const registration = await this.findRegistrationOrThrow(regId);
        if (registration.tournamentId !== tournamentId) {
            throw app_error_1.AppError.registrationNotFound();
        }
        if (registration.status === client_1.RegistrationStatus.CANCELLED) {
            throw app_error_1.AppError.registrationAlreadyCancelled();
        }
        if (registration.status === client_1.RegistrationStatus.REJECTED) {
            throw app_error_1.AppError.registrationAlreadyConfirmed();
        }
        return this.prisma.registration.update({
            where: { id: regId },
            data: { status: client_1.RegistrationStatus.REJECTED },
            include: REGISTRATION_INCLUDE,
        });
    }
    async listMine(userId) {
        return this.prisma.registration.findMany({
            where: { userId },
            include: REGISTRATION_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getRegisteredMembers(tournamentId, teamId) {
        const regs = await this.prisma.registration.findMany({
            where: {
                tournamentId,
                teamId,
                status: { notIn: [client_1.RegistrationStatus.CANCELLED, client_1.RegistrationStatus.REJECTED] },
            },
            select: {
                members: { select: { teamMemberId: true } },
            },
        });
        const memberIds = regs.flatMap((r) => r.members.map((m) => m.teamMemberId));
        return { memberIds };
    }
    async findOne(regId, userId) {
        const registration = await this.findRegistrationOrThrow(regId);
        if (registration.userId !== userId) {
            throw app_error_1.AppError.notRegistrationOwner();
        }
        return registration;
    }
    async cancelRegistration(regId, userId) {
        const registration = await this.findRegistrationOrThrow(regId);
        if (registration.userId !== userId) {
            throw app_error_1.AppError.notRegistrationOwner();
        }
        if (registration.status === client_1.RegistrationStatus.CANCELLED) {
            throw app_error_1.AppError.registrationAlreadyCancelled();
        }
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: registration.tournamentId },
        });
        if (tournament.status === client_1.TournamentStatus.IN_PROGRESS ||
            tournament.status === client_1.TournamentStatus.FINISHED ||
            tournament.status === client_1.TournamentStatus.CANCELLED) {
            throw app_error_1.AppError.cannotCancelStarted();
        }
        return this.prisma.registration.update({
            where: { id: regId },
            data: { status: client_1.RegistrationStatus.CANCELLED },
            include: REGISTRATION_INCLUDE,
        });
    }
    async handleStripeWebhook(event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const registrationId = session.metadata?.registrationId;
            if (!registrationId)
                return;
            const reg = await this.prisma.registration.update({
                where: { id: registrationId },
                data: {
                    paymentId: session.payment_intent,
                    paymentStatus: session.payment_status,
                    paidAt: new Date(),
                    status: client_1.RegistrationStatus.CONFIRMED,
                },
            });
            if (this.paymentsGateway) {
                this.paymentsGateway.emitPaymentConfirmed(reg.userId, registrationId);
            }
        }
    }
    async handlePaymentWebhook(dto) {
        const registration = await this.findRegistrationOrThrow(dto.registrationId);
        const newStatus = dto.status === 'CONFIRMED'
            ? client_1.RegistrationStatus.CONFIRMED
            : client_1.RegistrationStatus.PENDING_CONFIRMATION;
        const updated = await this.prisma.registration.update({
            where: { id: dto.registrationId },
            data: {
                paymentId: dto.paymentId,
                paymentStatus: dto.status,
                paidAt: new Date(),
                status: newStatus,
            },
            include: REGISTRATION_INCLUDE,
        });
        if (this.paymentsGateway && newStatus === client_1.RegistrationStatus.CONFIRMED) {
            this.paymentsGateway.emitPaymentConfirmed(updated.userId, dto.registrationId);
        }
        return updated;
    }
    async findRegistrationOrThrow(regId) {
        const registration = await this.prisma.registration.findUnique({
            where: { id: regId },
            include: REGISTRATION_INCLUDE,
        });
        if (!registration) {
            throw app_error_1.AppError.registrationNotFound();
        }
        return registration;
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bull_1.InjectQueue)('registration-expiry')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tournaments_service_1.TournamentsService,
        stripe_service_1.StripeService, Object])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map