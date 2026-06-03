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
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            userId: string | null;
            teamId: string;
        })[];
    } & {
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sport: string;
        ownerId: string;
    }>;
    findAll(userId: string): Promise<({
        _count: {
            members: number;
        };
    } & {
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sport: string;
        ownerId: string;
    })[]>;
    search(query: string, userId: string): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        sport: string;
        _count: {
            members: number;
        };
    }[]>;
    findOne(teamId: string, userId: string): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            userId: string | null;
            teamId: string;
        })[];
    } & {
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sport: string;
        ownerId: string;
    }>;
    update(teamId: string, userId: string, dto: UpdateTeamDto): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            userId: string | null;
            teamId: string;
        })[];
    } & {
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sport: string;
        ownerId: string;
    }>;
    remove(teamId: string, userId: string): Promise<void>;
    uploadAvatar(teamId: string, userId: string, file: Express.Multer.File): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            userId: string | null;
            teamId: string;
        })[];
    } & {
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sport: string;
        ownerId: string;
    }>;
    verifyOwnership(teamId: string, userId: string): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sport: string;
        ownerId: string;
    }>;
}
