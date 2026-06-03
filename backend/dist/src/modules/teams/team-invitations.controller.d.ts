import { TeamMembersService } from './team-members.service';
export declare class TeamInvitationsController {
    private readonly membersService;
    constructor(membersService: TeamMembersService);
    findPending(userId: string): Promise<({
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
    accept(invitationId: string, userId: string): Promise<{
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
    reject(invitationId: string, userId: string): Promise<{
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
}
