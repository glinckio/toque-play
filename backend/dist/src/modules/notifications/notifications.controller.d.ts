import { NotificationsService } from './notifications.service';
import { RegisterTokenDto } from './dto/register-token.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    registerToken(userId: string, dto: RegisterTokenDto): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        userId: string;
        platform: string;
    }>;
    removeToken(userId: string, token: string): Promise<void>;
    findMine(userId: string, page?: string, limit?: string, unread?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            title: string;
            userId: string;
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
        type: string;
        title: string;
        userId: string;
        body: string;
        referenceId: string | null;
        read: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
}
