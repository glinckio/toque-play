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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerToken(userId, token, platform) {
        return this.prisma.deviceToken.upsert({
            where: { userId_token: { userId, token } },
            update: { platform },
            create: { userId, token, platform },
        });
    }
    async removeToken(userId, token) {
        const deviceToken = await this.prisma.deviceToken.findUnique({
            where: { userId_token: { userId, token } },
        });
        if (!deviceToken)
            return;
        await this.prisma.deviceToken.delete({
            where: { id: deviceToken.id },
        });
    }
    async findMine(userId, page = 1, limit = 20, unreadOnly = false) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (unreadOnly)
            where.read = false;
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
        ]);
        return {
            data: notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, read: false },
        });
        return { unreadCount: count };
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification || notification.userId !== userId) {
            throw app_error_1.AppError.notificationNotFound();
        }
        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
        return { message: 'All notifications marked as read' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map