import { PrismaService } from '../../common/prisma.service';
import { CpfService } from '../../common/services/cpf.service';
import { NotificationService } from '../../common/services/notification.service';
import { TeamsService } from './teams.service';
import { AddMemberDto } from './dto/add-member.dto';
import { AddGuestDto } from './dto/add-guest.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
export declare class TeamMembersService {
    private prisma;
    private teamsService;
    private cpfService;
    private notificationService;
    constructor(prisma: PrismaService, teamsService: TeamsService, cpfService: CpfService, notificationService: NotificationService);
    addMember(teamId: string, ownerId: string, dto: AddMemberDto): Promise<{
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
    findPendingInvitations(userId: string): Promise<({
        team: {
            id: string;
            name: string;
            avatarUrl: string | null;
            owner: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvitationStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        invitedUserId: string;
        invitedById: string;
    })[]>;
    acceptInvitation(invitationId: string, userId: string): Promise<{
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
    rejectInvitation(invitationId: string, userId: string): Promise<{
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
    addGuest(teamId: string, ownerId: string, dto: AddGuestDto): Promise<{
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
    update(teamId: string, memberId: string, ownerId: string, dto: UpdateMemberDto): Promise<{
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
    remove(teamId: string, memberId: string, ownerId: string): Promise<void>;
    private checkCpfUnique;
}
