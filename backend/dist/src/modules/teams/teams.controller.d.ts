import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, userId: string, dto: UpdateTeamDto): Promise<{
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
    remove(id: string, userId: string): Promise<void>;
    uploadAvatar(id: string, userId: string, file: Express.Multer.File): Promise<{
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
}
