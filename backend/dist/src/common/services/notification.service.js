"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma.service");
const admin = __importStar(require("firebase-admin"));
let NotificationService = class NotificationService {
    prisma;
    config;
    firebaseApp = null;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    onModuleInit() {
        const projectId = this.config.get('FIREBASE_PROJECT_ID');
        const privateKey = this.config.get('FIREBASE_PRIVATE_KEY');
        const clientEmail = this.config.get('FIREBASE_CLIENT_EMAIL');
        if (projectId && privateKey && clientEmail && privateKey !== 'your-firebase-private-key') {
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                    clientEmail,
                }),
            });
        }
    }
    async sendToUsers(userIds, payload) {
        const category = this.mapTypeToCategory(payload.type);
        const eligibleUserIds = await this.filterByPreference(userIds, category);
        const notifications = await Promise.all(userIds.map((userId) => this.createNotification(userId, payload.title, payload.body, payload.type, payload.referenceId)));
        if (this.firebaseApp && eligibleUserIds.length > 0) {
            const tokens = await this.prisma.deviceToken.findMany({
                where: { userId: { in: eligibleUserIds } },
                select: { token: true, userId: true },
            });
            if (tokens.length > 0) {
                const deepLink = this.buildDeepLink(payload.type, payload.referenceId);
                await this.sendPushNotification(tokens.map((t) => t.token), payload, deepLink);
            }
        }
        return notifications;
    }
    async sendToRegion(latitude, longitude, radiusKm, payload) {
        const kmPerDegreeLat = 111;
        const kmPerDegreeLng = 111 * Math.cos((latitude * Math.PI) / 180);
        const latDelta = radiusKm / kmPerDegreeLat;
        const lngDelta = radiusKm / kmPerDegreeLng;
        const users = await this.prisma.user.findMany({
            where: {
                enableLocationNotifications: true,
                latitude: { not: null },
                longitude: { not: null },
                AND: [
                    { latitude: { gte: latitude - latDelta } },
                    { latitude: { lte: latitude + latDelta } },
                    { longitude: { gte: longitude - lngDelta } },
                    { longitude: { lte: longitude + lngDelta } },
                ],
            },
            select: { id: true },
        });
        if (users.length === 0)
            return [];
        return this.sendToUsers(users.map((u) => u.id), payload);
    }
    async createNotification(userId, title, body, type, referenceId) {
        return this.prisma.notification.create({
            data: { userId, title, body, type, referenceId },
        });
    }
    async getRegisteredAthleteUserIds(tournamentId) {
        const members = await this.prisma.registrationMember.findMany({
            where: {
                registration: {
                    tournamentId,
                    status: { notIn: ['CANCELLED', 'REJECTED'] },
                },
                teamMember: { isGuest: false, userId: { not: null } },
            },
            select: { teamMember: { select: { userId: true } } },
        });
        return [...new Set(members.map((m) => m.teamMember.userId).filter(Boolean))];
    }
    async getTeamMemberUserIds(teamId) {
        const members = await this.prisma.teamMember.findMany({
            where: { teamId, isGuest: false, userId: { not: null } },
            select: { userId: true },
        });
        return [...new Set(members.map((m) => m.userId).filter(Boolean))];
    }
    async sendPushNotification(tokens, payload, deepLink) {
        try {
            const message = {
                tokens,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: {
                    type: payload.type,
                    ...(payload.referenceId && { referenceId: payload.referenceId }),
                    ...(deepLink && { deepLink }),
                },
                apns: {
                    payload: { aps: { sound: 'default' } },
                },
                android: {
                    notification: { sound: 'default' },
                },
            };
            await admin.messaging().sendEachForMulticast(message);
        }
        catch (error) {
            console.error('[FCM] Error sending push notification:', error.message);
        }
    }
    buildDeepLink(type, referenceId) {
        if (!referenceId)
            return '';
        switch (type) {
            case 'TOURNAMENT':
            case 'BRACKET_GENERATED':
            case 'REGISTRATION':
            case 'REGISTRATION_CONFIRMED':
            case 'TOURNAMENT_STARTED':
            case 'TOURNAMENT_COMPLETED':
                return `toqueplay://tournament/${referenceId}`;
            case 'MATCH':
            case 'MATCH_START':
            case 'MATCH_FINISH':
            case 'MATCH_SET':
                return `toqueplay://match/${referenceId}`;
            case 'CHAT':
            case 'CHAT_MESSAGE':
                return `toqueplay://chat/${referenceId}`;
            case 'FRIENDLY':
            case 'FRIENDLY_REJECTED':
                return `toqueplay://friendly/${referenceId}`;
            case 'TEAM_INVITE':
                return `toqueplay://team-invitation/${referenceId}`;
            default:
                return '';
        }
    }
    mapTypeToCategory(type) {
        switch (type) {
            case 'CHAT':
            case 'CHAT_MESSAGE':
                return 'messages';
            case 'INVITE':
            case 'TEAM_INVITE':
                return 'invites';
            case 'MATCH':
            case 'MATCH_START':
            case 'MATCH_FINISH':
            case 'MATCH_SET':
                return 'matches';
            case 'FRIENDLY':
            case 'FRIENDLY_REJECTED':
                return 'friendlies';
            case 'TOURNAMENT':
            case 'BRACKET_GENERATED':
            case 'REGISTRATION':
            case 'REGISTRATION_CONFIRMED':
            case 'TOURNAMENT_STARTED':
            case 'TOURNAMENT_COMPLETED':
                return 'tournaments';
            default:
                return 'tournaments';
        }
    }
    async filterByPreference(userIds, category) {
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, notificationPreferences: true },
        });
        const DEFAULT_PREFS = { messages: true, invites: true, matches: true, friendlies: true, tournaments: true };
        return users
            .filter((u) => {
            const prefs = { ...DEFAULT_PREFS, ...(u.notificationPreferences || {}) };
            return prefs[category] !== false;
        })
            .map((u) => u.id);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map