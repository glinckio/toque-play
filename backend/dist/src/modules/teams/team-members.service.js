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
exports.TeamMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const cpf_service_1 = require("../../common/services/cpf.service");
const notification_service_1 = require("../../common/services/notification.service");
const teams_service_1 = require("./teams.service");
const app_error_1 = require("../../common/errors/app-error");
let TeamMembersService = class TeamMembersService {
    prisma;
    teamsService;
    cpfService;
    notificationService;
    constructor(prisma, teamsService, cpfService, notificationService) {
        this.prisma = prisma;
        this.teamsService = teamsService;
        this.cpfService = cpfService;
        this.notificationService = notificationService;
    }
    async addMember(teamId, ownerId, dto) {
        await this.teamsService.verifyOwnership(teamId, ownerId);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw app_error_1.AppError.userNotFoundByEmail();
        }
        const existingMember = await this.prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId: user.id } },
        });
        if (existingMember) {
            throw app_error_1.AppError.memberAlreadyInTeam();
        }
        const existingInvitation = await this.prisma.teamInvitation.findUnique({
            where: { teamId_invitedUserId: { teamId, invitedUserId: user.id } },
        });
        if (existingInvitation && existingInvitation.status === 'PENDING') {
            throw app_error_1.AppError.invitationAlreadyPending();
        }
        if (existingInvitation) {
            await this.prisma.teamInvitation.delete({
                where: { id: existingInvitation.id },
            });
        }
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            select: { name: true },
        });
        const invitation = await this.prisma.teamInvitation.create({
            data: {
                teamId,
                invitedUserId: user.id,
                invitedById: ownerId,
            },
            include: {
                team: { select: { id: true, name: true, avatarUrl: true } },
                invitedUser: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
        });
        await this.notificationService.sendToUsers([user.id], {
            title: 'Convite para time',
            body: `Você foi convidado para o time "${team?.name}"`,
            type: 'TEAM_INVITE',
            referenceId: invitation.id,
        });
        return invitation;
    }
    async findPendingInvitations(userId) {
        return this.prisma.teamInvitation.findMany({
            where: { invitedUserId: userId, status: 'PENDING' },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        owner: { select: { id: true, name: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async acceptInvitation(invitationId, userId) {
        const invitation = await this.prisma.teamInvitation.findUnique({
            where: { id: invitationId },
        });
        if (!invitation) {
            throw app_error_1.AppError.invitationNotFound();
        }
        if (invitation.invitedUserId !== userId) {
            throw app_error_1.AppError.notInvitedUser();
        }
        if (invitation.status !== 'PENDING') {
            throw app_error_1.AppError.invitationAlreadyResponded();
        }
        const existingMember = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: { teamId: invitation.teamId, userId },
            },
        });
        if (existingMember) {
            throw app_error_1.AppError.userAlreadyTeamMember();
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedInvitation = await tx.teamInvitation.update({
                where: { id: invitationId },
                data: { status: 'ACCEPTED' },
                include: {
                    team: { select: { id: true, name: true, avatarUrl: true } },
                    invitedUser: {
                        select: { id: true, name: true, email: true, avatarUrl: true },
                    },
                },
            });
            await tx.teamMember.create({
                data: {
                    teamId: invitation.teamId,
                    userId,
                    isCaptain: false,
                },
            });
            return updatedInvitation;
        });
    }
    async rejectInvitation(invitationId, userId) {
        const invitation = await this.prisma.teamInvitation.findUnique({
            where: { id: invitationId },
        });
        if (!invitation) {
            throw app_error_1.AppError.invitationNotFound();
        }
        if (invitation.invitedUserId !== userId) {
            throw app_error_1.AppError.notInvitedUser();
        }
        if (invitation.status !== 'PENDING') {
            throw app_error_1.AppError.invitationAlreadyResponded();
        }
        return this.prisma.teamInvitation.update({
            where: { id: invitationId },
            data: { status: 'REJECTED' },
            include: {
                team: { select: { id: true, name: true, avatarUrl: true } },
                invitedUser: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
        });
    }
    async addGuest(teamId, ownerId, dto) {
        await this.teamsService.verifyOwnership(teamId, ownerId);
        if (dto.cpf) {
            this.cpfService.validate(dto.cpf);
            await this.checkCpfUnique(teamId, dto.cpf);
        }
        return this.prisma.teamMember.create({
            data: {
                teamId,
                isGuest: true,
                guestName: dto.guestName,
                userId: null,
                ...(dto.cpf && { cpf: dto.cpf }),
            },
        });
    }
    async findAll(teamId, userId) {
        await this.teamsService.findOne(teamId, userId);
        return this.prisma.teamMember.findMany({
            where: { teamId },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
            orderBy: [{ isCaptain: 'desc' }, { id: 'asc' }],
        });
    }
    async update(teamId, memberId, ownerId, dto) {
        await this.teamsService.verifyOwnership(teamId, ownerId);
        const member = await this.prisma.teamMember.findFirst({
            where: { id: memberId, teamId },
        });
        if (!member) {
            throw app_error_1.AppError.memberNotFound();
        }
        return this.prisma.teamMember.update({
            where: { id: memberId },
            data: {
                ...(dto.isCaptain !== undefined && { isCaptain: dto.isCaptain }),
                ...(dto.position !== undefined && { position: dto.position }),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
        });
    }
    async remove(teamId, memberId, ownerId) {
        await this.teamsService.verifyOwnership(teamId, ownerId);
        const member = await this.prisma.teamMember.findFirst({
            where: { id: memberId, teamId },
        });
        if (!member) {
            throw app_error_1.AppError.memberNotFound();
        }
        if (member.userId === ownerId) {
            throw app_error_1.AppError.cannotRemoveOwner();
        }
        await this.prisma.teamMember.delete({ where: { id: memberId } });
    }
    async checkCpfUnique(teamId, cpf) {
        const existing = await this.prisma.teamMember.findFirst({
            where: { teamId, cpf },
        });
        if (existing) {
            throw app_error_1.AppError.cpfAlreadyInTeam();
        }
    }
};
exports.TeamMembersService = TeamMembersService;
exports.TeamMembersService = TeamMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        teams_service_1.TeamsService,
        cpf_service_1.CpfService,
        notification_service_1.NotificationService])
], TeamMembersService);
//# sourceMappingURL=team-members.service.js.map