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
        userId: string | null;
        teamId: string;
        guestName: string | null;
        cpf: string | null;
        isGuest: boolean;
        isCaptain: boolean;
        position: string | null;
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
        userId: string | null;
        teamId: string;
        guestName: string | null;
        cpf: string | null;
        isGuest: boolean;
        isCaptain: boolean;
        position: string | null;
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
        userId: string | null;
        teamId: string;
        guestName: string | null;
        cpf: string | null;
        isGuest: boolean;
        isCaptain: boolean;
        position: string | null;
    }>;
    remove(teamId: string, memberId: string, userId: string): Promise<void>;
}
