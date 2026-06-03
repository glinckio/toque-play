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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const client_1 = require("@prisma/client");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listUserChats(userId) {
        const teamMemberships = await this.prisma.teamMember.findMany({
            where: { userId },
            select: { teamId: true },
        });
        const teamIds = teamMemberships.map((m) => m.teamId);
        if (teamIds.length === 0)
            return [];
        return this.prisma.chat.findMany({
            where: {
                OR: [
                    { type: client_1.ChatType.INTRA_TEAM, teamId: { in: teamIds } },
                    {
                        type: client_1.ChatType.INTER_TEAM,
                        OR: [
                            { teamAId: { in: teamIds } },
                            { teamBId: { in: teamIds } },
                        ],
                    },
                ],
            },
            include: {
                team: { select: { id: true, name: true, avatarUrl: true } },
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: {
                        sender: { select: { id: true, name: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getMessages(chatId, userId, page = 1, limit = 30) {
        await this.validateAccess(chatId, userId);
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            this.prisma.chatMessage.findMany({
                where: { chatId },
                include: {
                    sender: { select: { id: true, name: true, avatarUrl: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.chatMessage.count({ where: { chatId } }),
        ]);
        return {
            data: messages.reverse(),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async sendMessage(chatId, userId, dto) {
        await this.validateAccess(chatId, userId);
        const message = await this.prisma.chatMessage.create({
            data: {
                chatId,
                senderId: userId,
                content: dto.content,
            },
            include: {
                sender: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
        await this.prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });
        return message;
    }
    async validateAccess(chatId, userId) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
        });
        if (!chat) {
            throw app_error_1.AppError.chatNotFound();
        }
        const isMember = await this.isUserInChat(chat, userId);
        if (!isMember) {
            throw app_error_1.AppError.notChatMember();
        }
        return chat;
    }
    async isUserInChat(chat, userId) {
        const teamIds = chat.type === client_1.ChatType.INTRA_TEAM
            ? [chat.teamId]
            : [chat.teamAId, chat.teamBId].filter(Boolean);
        if (teamIds.length === 0)
            return false;
        const membership = await this.prisma.teamMember.findFirst({
            where: {
                userId,
                teamId: { in: teamIds },
            },
        });
        return !!membership;
    }
    async createIntraTeamChat(teamId) {
        return this.prisma.chat.create({
            data: {
                type: client_1.ChatType.INTRA_TEAM,
                teamId,
            },
        });
    }
    async createInterTeamChat(teamAId, teamBId) {
        const sorted = [teamAId, teamBId].sort();
        const existing = await this.prisma.chat.findUnique({
            where: { teamAId_teamBId: { teamAId: sorted[0], teamBId: sorted[1] } },
        });
        if (existing)
            return existing;
        return this.prisma.chat.create({
            data: {
                type: client_1.ChatType.INTER_TEAM,
                teamAId: sorted[0],
                teamBId: sorted[1],
            },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map