import { AdminService } from './admin.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { QueryAdminTournamentsDto } from './dto/query-admin-tournaments.dto';
import { QueryLogsDto } from './dto/query-logs.dto';
import { QueryMetricsDto } from './dto/query-metrics.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<any>;
    listUsers(query: QueryUsersDto): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            avatarUrl: string | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    blockUser(id: string): Promise<{
        id: string;
        status: string;
    }>;
    unblockUser(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    listTournaments(query: QueryAdminTournamentsDto): Promise<{
        data: ({
            owner: {
                id: string;
                email: string;
                name: string;
            };
            _count: {
                registrations: number;
                brackets: number;
            };
        } & {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            ownerId: string;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            imageUrl: string | null;
            eventType: import(".prisma/client").$Enums.TournamentEventType;
            isPublished: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    blockTournament(id: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
    }>;
    deleteTournament(id: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
    }>;
    getLogs(query: QueryLogsDto): Promise<{
        id: string;
        createdAt: Date;
        level: string;
        source: string | null;
        message: string;
        stack: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    getMonitoring(): Promise<{
        activeMatches: number;
        onlineUsers: number;
        webSocketConnections: number;
    }>;
    getSystem(): Promise<{
        maintenanceMode: boolean;
        globalMessage: string | null;
        version: string;
    }>;
    updateSystem(dto: UpdateSystemDto): Promise<{
        maintenanceMode: boolean;
        globalMessage: string | null;
        version: string;
    }>;
    getMetrics(query: QueryMetricsDto): Promise<{
        totalUsers: number;
        newUsersInPeriod: number;
        totalTournaments: number;
        totalMatches: number;
        totalRegistrations: number;
        period: {
            from: string | null;
            to: string | null;
        };
    }>;
}
