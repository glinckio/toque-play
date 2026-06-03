import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
declare class UpdateLocationDto {
    latitude: number;
    longitude: number;
    enableLocationNotifications?: boolean;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        bio: string | null;
        isFirstAccess: boolean;
        notificationPreferences: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        bio: string | null;
        isFirstAccess: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLocation(userId: string, dto: UpdateLocationDto): Promise<{
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
                name: string;
                _count: {
                    registrations: number;
                };
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
export {};
