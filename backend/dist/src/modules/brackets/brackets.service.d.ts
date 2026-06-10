import { PrismaService } from '../../common/prisma.service';
import { NotificationService } from '../../common/services/notification.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { GenerateBracketDto } from './dto/generate-bracket.dto';
export declare class BracketsService {
    private prisma;
    private tournamentsService;
    private notificationService;
    constructor(prisma: PrismaService, tournamentsService: TournamentsService, notificationService: NotificationService);
    generateBracket(tournamentId: string, userId: string, dto: GenerateBracketDto): Promise<({
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
        };
        matches: ({
            teamA: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            teamB: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            sets: {
                id: string;
                matchId: string;
                setNumber: number;
                scoreA: number;
                scoreB: number;
            }[];
            pointEvents: {
                id: string;
                matchId: string;
                setNumber: number;
                timestamp: Date;
                scoredBy: string;
            }[];
            winner: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bestOfSets: number | null;
            tiebreakScore: number | null;
            position: number;
            round: number;
            bracketId: string | null;
            friendlyId: string | null;
            scheduledAt: Date | null;
            group: number | null;
            label: string | null;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        })[];
    } & {
        id: string;
        tournamentId: string;
        type: import(".prisma/client").$Enums.BracketType;
        categoryId: string;
    }) | null>;
    private generateSingleElimination;
    private advanceTeamToNextMatch;
    private generateRoundRobin;
    private generateGroupsThenElimination;
    checkAndAdvanceGroupTeams(matchId: string): Promise<void>;
    private fillNextMatchSlot;
    checkAndAdvanceRoundRobinTeams(matchId: string): Promise<void>;
    getBracket(tournamentId: string, categoryId?: string): Promise<{
        rounds: Record<number, any[]>;
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
        };
        matches: ({
            teamA: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            teamB: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            sets: {
                id: string;
                matchId: string;
                setNumber: number;
                scoreA: number;
                scoreB: number;
            }[];
            pointEvents: {
                id: string;
                matchId: string;
                setNumber: number;
                timestamp: Date;
                scoredBy: string;
            }[];
            winner: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bestOfSets: number | null;
            tiebreakScore: number | null;
            position: number;
            round: number;
            bracketId: string | null;
            friendlyId: string | null;
            scheduledAt: Date | null;
            group: number | null;
            label: string | null;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        })[];
        id: string;
        tournamentId: string;
        type: import(".prisma/client").$Enums.BracketType;
        categoryId: string;
    }[]>;
    private groupByRound;
}
