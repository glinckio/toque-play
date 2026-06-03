import { PrismaService } from '../../common/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    registerToken(userId: string, token: string, platform: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        platform: string;
    }>;
    removeToken(userId: string, token: string): Promise<void>;
    findMine(userId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            type: string;
            title: string;
            body: string;
            referenceId: string | null;
            read: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        title: string;
        body: string;
        referenceId: string | null;
        read: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
}
