import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
export declare class NotificationService implements OnModuleInit {
    private prisma;
    private config;
    private firebaseApp;
    constructor(prisma: PrismaService, config: ConfigService);
    onModuleInit(): void;
    sendToUsers(userIds: string[], payload: {
        title: string;
        body: string;
        type: string;
        referenceId?: string;
    }): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        userId: string;
        title: string;
        body: string;
        referenceId: string | null;
        read: boolean;
    }[]>;
    sendToRegion(latitude: number, longitude: number, radiusKm: number, payload: {
        title: string;
        body: string;
        type: string;
        referenceId?: string;
    }): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        userId: string;
        title: string;
        body: string;
        referenceId: string | null;
        read: boolean;
    }[]>;
    createNotification(userId: string, title: string, body: string, type: string, referenceId?: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        userId: string;
        title: string;
        body: string;
        referenceId: string | null;
        read: boolean;
    }>;
    getRegisteredAthleteUserIds(tournamentId: string): Promise<string[]>;
    getTeamMemberUserIds(teamId: string): Promise<string[]>;
    private sendPushNotification;
    private buildDeepLink;
    private mapTypeToCategory;
    private filterByPreference;
}
