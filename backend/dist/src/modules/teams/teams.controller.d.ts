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
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            userId: string | null;
            teamId: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            position: string | null;
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
            userId: string | null;
            teamId: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            position: string | null;
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
    update(id: string, userId: string, dto: UpdateTeamDto): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            userId: string | null;
            teamId: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            position: string | null;
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
    remove(id: string, userId: string): Promise<void>;
    uploadAvatar(id: string, userId: string, file: Express.Multer.File): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            userId: string | null;
            teamId: string;
            guestName: string | null;
            cpf: string | null;
            isGuest: boolean;
            isCaptain: boolean;
            position: string | null;
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
}
