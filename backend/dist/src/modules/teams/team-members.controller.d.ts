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
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        invitedUserId: string;
        invitedById: string;
    }>;
    addGuest(teamId: string, userId: string, dto: AddGuestDto): Promise<{
        id: string;
        guestName: string | null;
        cpf: string | null;
        isGuest: boolean;
        isCaptain: boolean;
        userId: string | null;
        teamId: string;
    }>;
    findAll(teamId: string, userId: string): Promise<({
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
    })[]>;
    update(teamId: string, memberId: string, userId: string, dto: UpdateMemberDto): Promise<{
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
    }>;
    remove(teamId: string, memberId: string, userId: string): Promise<void>;
}
