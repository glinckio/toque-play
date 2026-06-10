import { PrismaService } from '../../common/prisma.service';
export declare class HomeService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: string): Promise<{
        upcomingTournaments: {
            id: any;
            name: any;
            startDate: any;
            city: any;
            street: any;
            number: any;
            neighborhood: any;
            state: any;
            location: string;
            modality: any;
            registrationCount: any;
            isRegistered: boolean;
        }[];
        pendingFriendlies: {
            id: string;
            title: string | null;
            teamAName: string;
            teamBName: string;
            date: string;
            status: import(".prisma/client").$Enums.FriendlyStatus;
        }[];
        acceptedFriendlies: ({
            match: {
                id: string;
                status: import(".prisma/client").$Enums.MatchStatus;
                scoreTeamA: number;
                scoreTeamB: number;
                teamA: {
                    id: string;
                    name: string;
                } | null;
                teamB: {
                    id: string;
                    name: string;
                } | null;
                sets: {
                    id: string;
                    matchId: string;
                    setNumber: number;
                    scoreA: number;
                    scoreB: number;
                }[];
            } | null;
            requester: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
            requesterTeam: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            challenged: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            challengedTeam: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            modality: string | null;
            startTime: Date | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.FriendlyStatus;
            latitude: number | null;
            longitude: number | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            date: Date;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            title: string | null;
            categoryFormat: string | null;
            scoreTeamA: number | null;
            scoreTeamB: number | null;
            matchId: string | null;
            requesterId: string;
            requesterTeamId: string | null;
            challengedId: string | null;
            challengedTeamId: string | null;
            addressNumber: string | null;
        })[];
        unreadNotifications: number;
    }>;
    private getUpcomingTournaments;
    private getPendingFriendlies;
    private getAcceptedFriendlies;
    private getUnreadCount;
    getFeed(userId: string): Promise<({
        type: "NEW_TOURNAMENT";
        referenceId: string;
        title: string;
        subtitle: string | undefined;
        timestamp: Date;
    } | {
        type: "TOURNAMENT_RESULT";
        referenceId: string;
        title: string;
        subtitle: string | undefined;
        timestamp: Date;
    } | {
        type: "FRIENDLY_CONFIRMED";
        referenceId: string;
        title: string;
        subtitle: string;
        timestamp: Date;
    })[]>;
    private getNewTournamentsNearby;
    private getFinishedResults;
    private getConfirmedFriendlies;
}
