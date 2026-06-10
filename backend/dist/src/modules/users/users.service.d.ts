import { PrismaService } from '../../common/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
import { StorageService } from '../storage/storage.service';
export declare class UsersService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        bio: string | null;
        isFirstAccess: boolean;
        notificationPreferences: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateProfile(userId: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        bio: string | null;
        isFirstAccess: boolean;
    }>;
    updateLocation(userId: string, data: {
        latitude: number;
        longitude: number;
        enableLocationNotifications?: boolean;
    }): Promise<{
        id: string;
        latitude: number | null;
        longitude: number | null;
        enableLocationNotifications: boolean;
    }>;
    getNotificationPreferences(userId: string): Promise<{
        messages: boolean;
        invites: boolean;
        matches: boolean;
        friendlies: boolean;
        tournaments: boolean;
    }>;
    updateNotificationPreferences(userId: string, dto: NotificationPreferencesDto): Promise<Record<string, boolean>>;
    shouldNotify(userId: string, category: string): Promise<boolean>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        bio: string | null;
        isFirstAccess: boolean;
        notificationPreferences: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getUserStats(userId: string): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        totals: {
            winRate: number;
            matchesPlayed: number;
            matchesWon: number;
            setsWon: number;
            pointsScored: number;
            mvpCount: number;
        };
        byTournament: {
            tournament: {
                id: string;
                _count: {
                    registrations: number;
                };
                name: string;
                stages: {
                    date: Date;
                }[];
            };
            team: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
            matchesPlayed: number;
            matchesWon: number;
            setsWon: number;
            pointsScored: number;
            mvpCount: number;
        }[];
    }>;
}
