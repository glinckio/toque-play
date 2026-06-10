import { TeamMembersService } from './team-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { AddGuestDto } from './dto/add-guest.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
export declare class TeamMembersController {
    private readonly membersService;
    constructor(membersService: TeamMembersService);
    addMember(teamId: string, userId: string, dto: AddMemberDto): Promise<{
        team: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        invitedUser: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        positions: import(".prisma/client").$Enums.VolleyballPosition[];
        status: import(".prisma/client").$Enums.InvitationStatus;
        invitedUserId: string;
        invitedById: string;
    }>;
    addGuest(teamId: string, userId: string, dto: AddGuestDto): Promise<{
        id: string;
        teamId: string;
        userId: string | null;
        guestName: string | null;
        cpf: string | null;
        isGuest: boolean;
        isCaptain: boolean;
        positions: import(".prisma/client").$Enums.VolleyballPosition[];
    }>;
    findAll(teamId: string, userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
            phone: string | null;
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
    })[]>;
    update(teamId: string, memberId: string, userId: string, dto: UpdateMemberDto): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
            phone: string | null;
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
    }>;
    remove(teamId: string, memberId: string, userId: string): Promise<void>;
}
