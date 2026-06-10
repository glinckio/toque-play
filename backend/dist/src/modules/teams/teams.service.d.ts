import { PrismaService } from '../../common/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private prisma;
    private storage;
    private chatService;
    constructor(prisma: PrismaService, storage: StorageService);
    setChatService(chatService: any): void;
    create(userId: string, dto: CreateTeamDto): Promise<{
        members: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
                email: string;
            } | null;
        } & {
            id: string;
            teamId: string;
            userId: string | null;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            positions: import(".prisma/client").$Enums.VolleyballPosition[];
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        avatarUrl: string | null;
        sport: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<({
        _count: {
            members: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        avatarUrl: string | null;
        sport: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    search(query: string, userId: string): Promise<{
        id: any;
        name: any;
        avatarUrl: any;
        sport: any;
        _count: {
            members: any;
        };
    }[]>;
    findOne(teamId: string, userId: string): Promise<{
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        members: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
                email: string;
            } | null;
        } & {
            id: string;
            teamId: string;
            userId: string | null;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            positions: import(".prisma/client").$Enums.VolleyballPosition[];
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        avatarUrl: string | null;
        sport: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(teamId: string, userId: string, dto: UpdateTeamDto): Promise<{
        members: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
                email: string;
            } | null;
        } & {
            id: string;
            teamId: string;
            userId: string | null;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            positions: import(".prisma/client").$Enums.VolleyballPosition[];
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        avatarUrl: string | null;
        sport: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(teamId: string, userId: string): Promise<void>;
    uploadAvatar(teamId: string, userId: string, file: Express.Multer.File): Promise<{
        members: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
                email: string;
            } | null;
        } & {
            id: string;
            teamId: string;
            userId: string | null;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            positions: import(".prisma/client").$Enums.VolleyballPosition[];
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        avatarUrl: string | null;
        sport: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyOwnership(teamId: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        avatarUrl: string | null;
        sport: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
